const express = require('express')
const app = express()
const port = 3000
const http = require("http");
const server = http.createServer(app);

const register = require('./routes/register')
const login = require('./routes/login')
const completeProfile = require('./routes/complete_profile')

app.use(express.json())
app.use('/register', register)
app.use('/login', login)
app.use('/complete_profile', completeProfile)

server.listen(port, () => console.log(`Matcha listening on port ${port}`))


// nodemon -x "printf '\x1Bc';node" index.js
