const express = require('express')
const router = express.Router()
const validateRegistrationInput = require('../middlewares/validateRegistrationInput')

router.post('/', validateRegistrationInput, (req, res) => {
    const { firstname, lastname, username, email, password } = req.body
    res.json('registration')
})

module.exports = router
