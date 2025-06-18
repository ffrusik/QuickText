const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()

const mockNotes = [
    { id: 1, noteText: '123123132'},
    { id: 2, noteText: 'qweqweqwe'},
    { id: 3, noteText: 'asdasdasd'}
]

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

        res.render('index', { notes }) // user authentication? (cookies + database) 
    })

router
    .route('/notes/:id')
    .get((req, res) => {
        console.log(req.params);
        const parsedId = parseInt(req.params.id);
        console.log(parsedId);
        if (isNaN(parsedId)) 
            return res.status(400).send({msg: 'Bad request. Invalid ID.'});

        const findNote = mockNotes.find((note) => note.id === parsedId);
        if (!findNote) return res.sendStatus(404);
        return res.send(findNote);

        // res.render('index', { documentId: req.params.id, username: 'Ruslan'}) // id of document (cookies + database)
    })
    .put((req, res) => {
        res.send(`Updating the document with ID ${req.params.id}`) // may change the content AND the name of the document
    })
    .delete((req, res) => {
        res.send(`Deleting the document with ID ${req.params.id}`)
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

        notes.push(req.body.note);

        res.cookie('note', JSON.stringify(notes), {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        res.redirect('/')

        //res.cookie( "monster_cookie", "Yummy Yummy" ).send( "Monster Cookie!" )
        //res.send(`Note: ${req.body.note}`);
    })


    
// router.param('id', (req, res, next, id) => {
//     console.log(id)
//     next()
// })

module.exports = router