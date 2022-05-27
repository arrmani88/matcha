const express = require('express')
const app = express()
const port = 3000
const http = require("http");
const server = http.createServer(app);

const register = require('./routes/register')
const login = require('./routes/login')
const completeProfile = require('./routes/complete_profile')
const uploadProfileImage = require('./routes/upload_profile_image')
const uploadFeedImages = require('./routes/upload_feed_images')

app.use(express.json())
app.use('/register', register)
app.use('/login', login)
app.use('/complete_profile', completeProfile)
app.use('/upload_profile_image', uploadProfileImage)
app.use('/upload_feed_images', uploadFeedImages)

server.listen(port, () => console.log(`Matcha listening on port ${port}`))


// nodemon -x "printf '\x1Bc';node" index.js
// npm install -g --force nodemon