const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    const { firstname, lastname, username, email, password } = req.body
    
})