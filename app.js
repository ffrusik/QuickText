const express = require('express')
const app = express()
const PORT = 3000

app.set('view engine', 'ejs')

const indexRouter = require('./routes/index') // can create more routes => import them into index => require only index router

app.use(express.static(__dirname + '/public'))
app.use('/', indexRouter)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`)
})