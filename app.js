require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const { credentials } = require('./conf')
const methodOverride = require('method-override')
const session = require('express-session')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(credentials.secretCookie))
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
    }
}))

const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')

const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')
const { cookie } = require('express-validator')

app.use(express.static(__dirname + '/public'))
app.use('/', indexRouter, apiRouter)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`)
})