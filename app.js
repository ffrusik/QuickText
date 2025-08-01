const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const { credentials } = require('./conf')
const methodOverride = require('method-override')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(credentials.secretCookie))
app.use(methodOverride('_method'))

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