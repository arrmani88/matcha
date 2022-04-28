const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const dbController = require('../models/dbController')
const { validateRegistrationInput } = require('../middlewares/validateRegistrationInput')

router.post('/', validateRegistrationInput, (req, res) => {
    const { firstname, lastname, username, email, password } = req.body
    bcrypt.hash(password, 10).then((hash) => {
        dbController.query(
            "INSERT INTO users(firstname, lastname, username, email, password) VALUES(?,?,?,?,?);",
            [firstname, lastname, username, email, hash],
            (error) => { if (error) console.log(error) }
        )
        res.send("Registered successfully")
    })
})

module.exports = router
