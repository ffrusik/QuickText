const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()

router
    .route('/')
    .get((req, res) => {
        let notes = [];

        if (req.cookies.note) {
            try {
                notes = JSON.parse(req.cookies.note)
            } catch (err) {
                console.log('Invalid cookie format')
            }
        }

        res.render('index', { notes })
    })

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

        const {note, noteIndex} = req.body

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

// router.param('id', (req, res, next, id) => {
//     console.log(id)
//     next()
// })

module.exports = router