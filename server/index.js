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
const confirmEmail = require('./routes/confirm_email')
const updateProfile = require('./routes/update_profile.js')
const resetPassword = require('./routes/reset_password.js')
const like = require('./routes/like')
const unlike = require('./routes/unlike')

app.use(express.json())
app.use('/register', register)
app.use('/login', login)
app.use('/complete_profile', completeProfile)
app.use('/upload_profile_image', uploadProfileImage)
app.use('/upload_feed_images', uploadFeedImages)
app.use('/confirm_email', confirmEmail)
app.use('/update_profile', updateProfile)
app.use('/reset_password', resetPassword)
app.use('/like', like)
app.use('/unlike', unlike)

server.listen(port, () => console.log(`Matcha listening on port ${port}`))


// nodemon -x "printf '\x1Bc';node" index.js
// npm install -g --force nodemon
// INSERT INTO tags(title) VALUES('football')
