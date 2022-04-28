const express = require('express')
const app = express()
const port = 3000
const http = require("http");
const server = http.createServer(app);

const users = require('./routes/users')
const register = require('./routes/register')

app.use(express.json())
app.use('/users', users)
app.use('/register', register)

server.listen(port, () => console.log(`Matcha listening on port ${port}`))
