const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const pool = require('../db')

router
    .route('/')
    .get((req, res) => {
        let notes = [];
        const cookiesAccepted = req.headers.cookie?.includes('cookiesAccepted=true')

        if (req.cookies.note) {
            try {
                notes = JSON.parse(req.cookies.note)
            } catch (err) {
                console.log('Invalid cookie format')
            }
        }

        userId = req.session.userId

        res.render('index', { notes, cookiesAccepted, userId })
    })

router
    .route('/account')
    .get(async (req, res) => {

        const cookiesAccepted = req.headers.cookie?.includes('cookiesAccepted=true')
        
        if (!req.session.userId) {
            return res.status(401).send('You must be logged in to access this page')
        }
        else {
            try {
                const result = await pool.query(
                    `SELECT u.username, n.content 
                    FROM users u
                    LEFT JOIN notes n ON u.id = n.user_id
                    WHERE u.username = $1`,
                    [req.session.username]
                )
                
                const username = result.rows[0]?.username || 'Unknown'
                const notes = result.rows.map(row => row.content)

                const acc = [req.session.userId, username, []]
                res.render('account', {acc, cookiesAccepted})
            }
            catch (err) {
                console.log(err)
                res.status(500).send('Database error')
            }
        }
    })

router
    .route('/register')
    .get((req, res) => {
        const cookiesAccepted = req.headers.cookie?.includes('cookiesAccepted=true')
        res.render('register', { cookiesAccepted })
    })

router
    .route('/login')
    .get((req, res) => {
        const cookiesAccepted = req.headers.cookie?.includes('cookiesAccepted=true')
        res.render('login', { cookiesAccepted })
    })

module.exports = router