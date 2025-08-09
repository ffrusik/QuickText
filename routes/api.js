const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

router
    .route('/api/create_note')
    .post((req, res) => {
        let notes = []

        if (req.cookies.notes) {
            try {
                notes = JSON.parse(req.cookies.notes)
            } catch (err) {
                console.error('Failed to parse cookie: ', err)
            }
        }

        const { note, noteId } = req.body

        if (noteId !== undefined && noteId !== '' && note !== '') {
            const noteToUpdate = notes.find(n => n.id === noteId)
            if (noteToUpdate) {
                noteToUpdate.text = note
                noteToUpdate.updatedAt = new Date().toISOString()
            }
            else {
                notes.push({
                    id: uuidv4(),
                    text: note,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
        }
        else if (note !== '') {
            notes.push({
                id: uuidv4(),
                text: note,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        }
        else {
            console.log('Empty draft')
        }

        res.cookie('notes', JSON.stringify(notes), {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        res.redirect('/')
    })

router
    .route('/api/delete_notes')
    .delete((req, res) => {
        if (req.cookies.notes) {
            try {
                res.clearCookie('notes')
            } catch (err) {
                console.log('Failed to delete cookie: ', err)
            }
        }

        res.redirect('/')
    })
    
router
    .route('/api/delete_note')
    .delete((req, res) => {
        let notes = []

        if (req.cookies.notes) {
            try {
                notes = JSON.parse(req.cookies.notes)
            } catch (err) {
                console.log('Failed to parse cookie: ', err)
            }
        }

        const idToDelete = req.body.noteId
        if (idToDelete) {
            notes = notes.filter(note => note.id !== idToDelete)
        }

        res.cookie('notes', JSON.stringify(notes), {
            httpOnly: true,
            maxAge: 90 * 24 * 60 * 60 * 1000
        })

        res.redirect('/')
    })

router
    .route('/api/unlogin')
    .delete((req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send("Couldn't log out")
            }
            res.redirect('/')
        })
    })

router
    .route('/api/login')
    .post(async (req, res) => {
        const { username, password, repeatPassword } = req.body

        try {
            const result = await pool.query(
                `SELECT id, username, password
                FROM users u
                WHERE username = $1`,
                [username]
            )

            if (result.rows.length == 0) {
                return res.status(401).send('User not found')
            }

            if (password != repeatPassword) {
                return res.status(400).send('Passwords do not match')
            }

            const user = result.rows[0]

            const passwordMatches = await bcrypt.compare(password, user.password)

            if (!passwordMatches) {
                return res.status(401).send('Incorrect password')
            }

            req.session.userId = user.id
            req.session.username = user.username

            console.log('Logged in as: ', req.session)

            res.redirect('/account')
        } catch(err) {
            console.error('Error loginning: ', err)
            res.status(500).send('Internal server error')
        }
    })

router
    .route('/api/register')
    .post(async (req, res) => {
        const { username, password, repeatPassword } = req.body

        try {
            const userCheck = await pool.query(
                `SELECT * FROM users
                WHERE username = $1`,
                [username]
            )

            if (userCheck.rows.length > 0) {
                return res.status(409).send('Username already exists')
            }

            if (password != repeatPassword) {
                return res.status(400).send('Passwords do not match')
            }

            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            console.log('Storing: ', username, hashedPassword)

            await pool.query(
                `INSERT INTO users (username, password)
                VALUES ($1, $2)`,
                [username, hashedPassword]
            )

            res.redirect('/')
        } catch (err) {
            console.error('Error registering: ', err)
            res.status(500).send('Internal server error')
        }
        
    })

router
    .route('/api/save_to_db')
    .post(async (req, res) => {
        // Create a single button that will firstly delete all of the notes in the database, replacing them with the ones that 
    })
    
module.exports = router