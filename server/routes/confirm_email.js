const { verify, sign } = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const dotenv = require("dotenv")
dotenv.config()
const dbController = require('../models/db_controller')

router.get('/:emailConfirmationToken', async (req, res) => {
    try {
        const emailConfirmationToken = req.params.emailConfirmationToken
        const decodedData = verify(emailConfirmationToken, process.env.EMAIL_CONFIRMATION_RANDOM_STRING)
        var user
        if (decodedData) {
            dbController.query(
                "SELECT * FROM users WHERE id = ?",
                decodedData.id,
                (error, result) => {
                    if (error) {
                        return res.status(400).json(error)
                    }
                    user = result
                    dbController.query(
                        "UPDATE users SET isAccountConfirmed = ? WHERE id = ?",
                        [1, decodedData.id],
                        (err) => {
                            if (err) return res.status(400).json({ error: err })
                            else {
                                const accessToken = sign(
                                    { username: decodedData.username, id: decodedData.id },
                                    process.env.LOGIN_RANDOM_STRING
                                )
                                dbController.query(
                                    'SELECT * FROM images WHERE uid = ?',
                                    decodedData.id,
                                    (error, images) => {
                                        if (error) return res.status(400).json({ error })
                                        const { password, created_at, updated_at, fameRating, areTagsAdded, ...userPublicData } = result[0]
                                        res.json({
                                            'access_token': accessToken,
                                            ...userPublicData,
                                            images: images
                                        })
                                    }
                                )
                            }
                        }
                    )
                }
            )
        }
    } catch (error) {
        return res.status(400).json({ error })
    }
})

module.exports = router
