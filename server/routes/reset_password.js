const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()
const { verify, sign } = require('jsonwebtoken')
const dbController = require('../models/db_controller')
const { Router } = require('express')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

let transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: process.env.EMAIL_ADDR,
		pass: process.env.EMAIL_PASS
	}
})

// send email to reset password
router.get('/', (req, res) => {
	const { username } = req.body
	const resetPasswordToken =  sign(
		{ username },
		process.env.PASSWORD_RESET_RANDOM_STRING
	)
	let sentEmail = transporter.sendMail(
		{
			from: process.env.EMAIL_ADDR,
			to: 'pirotil826@falkyz.com',
			subject: "Matcha password reset",
			html: `http://localhost:3000/reset_password/${resetPasswordToken}`
		},
		(err, info) => {
			console.log(`http://localhost:3000/reset_password/${resetPasswordToken}`)
			if (err) res.status(400).json({ error: err.stack })
			else res.json(" An email was sent to your mailbox to reset your password, please check your inbox")
		}
	)
})

// update password in DB
router.post('/:token', (req, res) => {
	const token = req.params.token
	const { password } = req.body
	const decodedData = verify(token, process.env.PASSWORD_RESET_RANDOM_STRING)
	dbController.query(
		"SELECT * FROM users WHERE username = ? LIMIT 1",
		[decodedData.username],
		(err, result) => {
			if (err) res.status(400).json({ error: error, description: err.message })
			else {
				bcrypt.hash(password, 10).then((hashedPassword) => {
					dbController.query(
						"UPDATE users SET password = ? WHERE username = ?",
						[hashedPassword, decodedData.username],
						(err) => {
							if (err) res.status(400).json({ error: error, description: err.message })
							else {
								const accessToken = sign(
									{username: decodedData.username, id: result[0].id},
									process.env.LOGIN_RANDOM_STRING
								)
								res.json({"accessToken": accessToken, "expires_in": "never"})
							}
						}
					)
				})
			}
		}
	)
})

module.exports = router
