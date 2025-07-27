const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const pool = require('../db')

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
    .route('/account')
    .get(async (req, res) => {
        
        userId = 1

        try {
            const result = await pool.query(
                `   SELECT u.username, n.content
                FROM users u 
                JOIN notes n ON u.id = n.id
                WHERE u.id = $1`, 
                [userId]
            )
            
            const username = result.rows[0]?.username || 'Unknown'
            const notes = result.rows.map(row => row.content)

            const acc = [userId, username, notes]
            res.render('account', {acc})
        }
        catch (err) {
            console.log(err)
            res.status(500).send('Database error')
        }
    })

router
    .route('/register')
    .get((req, res) => {
        res.render('register')
    })

router
    .route('/login')
    .get((req, res) => {
        res.render('login')
    })

module.exports = router