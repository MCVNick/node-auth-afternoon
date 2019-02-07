require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const { json } = require('body-parser')
const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env
const AuthCtrl = require('./controller/Auth')
const TreasureCtrl = require('./controller/Treasures')
const auth = require('./middleware/authMiddleware')

const app = express()

massive(CONNECTION_STRING)
    .then(db => {
        app.set('db', db)
        console.log('Connected to database')
    })

app.use(json())
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

//the endpoints
app.post('/auth/login', AuthCtrl.login)
app.post('/auth/register', AuthCtrl.register)
app.get('/auth/logout', AuthCtrl.logout)
app.get('/api/treasure/dragon', TreasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, TreasureCtrl.getMyTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, TreasureCtrl.getAllTreasure)
app.post('/api/treasure/user', auth.usersOnly, TreasureCtrl.addMyTreasure)




const port = SERVER_PORT || 3000
app.listen(port, () => console.log('Listening on port', port))