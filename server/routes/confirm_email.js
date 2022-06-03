const { verify, decode } = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const dotenv = require("dotenv")
dotenv.config()
const dbController = require('../models/db_controller')
const { sign } = require('jsonwebtoken')

router.get('/:emailConfirmationToken', async (req, res) => {
    try {
        const emailConfirmationToken = req.params.emailConfirmationToken
        const decodedData = verify(emailConfirmationToken, process.env.EMAIL_CONFIRMATION_RANDOM_STRING)
        if (decodedData) {
            // console.log(decodedData) // { username: 'arrmani88', id: 24, iat: 1654214198 } 
            dbController.query(
                "UPDATE users SET isAccountConfirmed = ? WHERE id = ?",
                [1, decodedData.id],
                (err) => {
                    console.log(decodedData.id)
                    if (err) res.status(400).json({ error: err })
                    else { 
                        const accessToken = sign(
							{ username: decodedData.username, id: decodedData.id },
							process.env.REGISTRATION_RANDOM_STR
						)
                        res.json({
                            message: `Account email confirmed successfully id=${decodedData.id}`,
                            'access_token': accessToken,
                            "expires_in": 'never'
                        })
                    }
                }
            )
        }
    } catch (err) {
        return res.status(400).json({ error: err })
    }
})

module.exports = router

