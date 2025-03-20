const express = require('express')
const router = express.Router()

router
    .route('/')
    .get((req, res) => {
        res.render('index', { username: 'Ruslan' }) // user authentication? (cookies + database) 
    })
    .post((req, res) => {
        res.send('Creating the document')
    })

router
    .route('/notes')
    .get((req, res) => {
        res.render('index', { documentId: req.params.id, username: 'Ruslan'}) // id of document (cookies + database)
    })
    .patch((req, res) => {
        res.send(`Renaming the document with ID ${req.params.id}`) // probably only viable for renaming the document
    })

router
    .route('/notes/:id')
    .get((req, res) => {
        res.render('index', { documentId: req.params.id, username: 'Ruslan'}) // id of document (cookies + database)
    })
    .put((req, res) => {
        res.send(`Updating the document with ID ${req.params.id}`) // may change the content AND the name of the document
    })
    .delete((req, res) => {
        res.send(`Deleting the document with ID ${req.params.id}`)
    })

router.param('id', (req, res, next, id) => {
    console.log(id)
    next()
})

module.exports = router