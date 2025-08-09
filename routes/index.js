const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const pool = require('../db')

router
    .route('/')
    .get((req, res) => {
        let notes = [];
        const cookiesAccepted = req.headers.cookie?.includes('cookiesAccepted=true')

        if (req.cookies.notes) {
            try {
                notes = JSON.parse(req.cookies.notes)
            } catch (err) {
                console.log('Invalid cookie format')
            }
        }

        const userId = req.session.userId

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
                    `SELECT u.username, n.content, n.created_at, n.updated_at 
                    FROM users u
                    LEFT JOIN notes n ON u.id = n.user_id
                    WHERE u.id = $1`,
                    [req.session.userId]
                )
                
                const username = result.rows[0]?.username || 'Unknown'
                const notes = result.rows
                    .filter(row => row.content !== null)
                    .map(row => ({
                        id: row.id,
                        content: row.content,
                        createdAt: row.created_at,
                        updatedAt: row.updatedAt
                    }))

                res.render('account', { userId: req.session.userId, username, notes, cookiesAccepted })
            }
            catch (err) {
                console.error(err)
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