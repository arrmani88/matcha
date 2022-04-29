const express = require('express')
const app = express()
const port = 3000
const http = require("http");
const server = http.createServer(app);

const users = require('./routes/users')
const register = require('./routes/register')
const login = require('./routes/login')

app.use(express.json())
app.use('/users', users)
app.use('/register', register)
app.use('/login', login)

server.listen(port, () => console.log(`Matcha listening on port ${port}`))


// nodemon -x "clear;node" index.js