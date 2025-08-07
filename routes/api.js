const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcrypt')

router
    .route('/api/create_note')
    .post((req, res) => {
        let notes = []

        if (req.cookies.note) {
            try {
                notes = JSON.parse(req.cookies.note)
            } catch (err) {
                console.error('Failed to parse cookie: ', err)
            }
        }

        const { note, noteIndex } = req.body

        if (noteIndex !== undefined && noteIndex !== '' && !isNaN(noteIndex) && note !== '') {
            const idx = parseInt(noteIndex)
            if (idx >= 0 && idx < notes.length) {
                notes[idx] = note
            }
        }
        else if (note !== '') {
            notes.push(note)
        }
        else {
            console.log('Empty draft')
        }

        res.cookie('note', JSON.stringify(notes), {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        res.redirect('/')
    })

router
    .route('/api/delete_notes')
    .delete((req, res) => {
        if (req.cookies.note) {
            try {
                res.clearCookie('note')
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

        if (req.cookies.note) {
            try {
                notes = JSON.parse(req.cookies.note)
            } catch (err) {
                console.log('Failed to parse cookie: ', err)
            }
        }

        const indexToDelete = parseInt(req.body.noteIndex)
        if (!isNaN(indexToDelete) && indexToDelete >= 0 && indexToDelete < notes.length) {
            notes.splice(indexToDelete, 1)
        }

        res.cookie('note', JSON.stringify(notes), {
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

module.exports = router