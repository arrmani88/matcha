const dotenv = require("dotenv")
dotenv.config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { isName, isUsername, isEmail, isPassword } = require("../functions/input_validation")
const dbController = require("../models/db_controller")
const fieldIsNullMessage = "One of the fields 'firstname', 'lastname', 'username', 'email' or 'password' is empty or wasn't sent"

const validateRegistrationInput = async (req, res, next) => {
	console.log(process.env.EMAIL_ADDR)
	console.log(process.env.EMAIL_PASS)
	try {
		const { firstname, lastname, username, email, password } = req.body
		if (!firstname || !lastname || !username || !email || !password) {
			res.status(422)
			return res.json({ error: { 'details': fieldIsNullMessage } })
		} else if (!isName(firstname)) {
			res.status(422)
			return res.json({ error: { "details": "Invalid 'firstname' syntax" } })
		} else if (!isName(lastname)) {
			res.status(422)
			return res.json({ error: { "details": "Invalid 'lastname' syntax" } })
		} else if (!isUsername(username)) {
			res.status(422)
			return res.json({ error: { "details": "Invalid 'username' syntax" } })
		} else if (!isEmail(email)) {
			res.status(422)
			return res.json({ error: { "details": "Invalid 'email' syntax" } })
		} else if (!isPassword(password)) {
			res.status(422)
			return res.json({ error: { "details": "Field 'password' should contain minimum 8 characters, at least one letter" } })
		} else {
			dbController.query(
				"SELECT * FROM users WHERE username LIKE ? OR email LIKE ? LIMIT 1",
				[username, email],
				(error, result) => {
					if (error) return console.log(error)
					if (result.length == 0) return next()
					else {
						return res.status(409).json({ "Exception": { "Details": "Username or email already used" } })
					}
				}
			)
		}
	} catch (error) {
		return console.log(error)
	}
}

let transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: process.env.EMAIL_ADDR,
		pass: process.env.EMAIL_PASS
	}
})

// router.post('/', validateRegistrationInput, async (req, res) => {
router.post('/', async (req, res) => {
	const { firstname, lastname, username, email, password } = req.body
	bcrypt.hash(password, 10).then((hashedPassword) => {
		dbController.query(
			"INSERT INTO users(firstname, lastname, username, email, password) VALUES(?,?,?,?,?);",
			[firstname, lastname, username, email, hashedPassword],
			(error) => { if (error) return res.status(400).json(error) }
		)
		dbController.query(
			"SELECT * FROM users WHERE username = ?",
			[username],
			async (error, result) => {
				if (error) { return res.json({ 'error': error }) }
				else {
					try {
						const emailConfirmationToken = sign(
							{ username, id: result[0].id },
							process.env.EMAIL_CONFIRMATION_RANDOM_STRING
						)
						console.log(`emailToken= \t${emailConfirmationToken}`)
						let sentEmail = transporter.sendMail(
							{
								from: process.env.EMAIL_ADDR,
								to: 'pirotil826@falkyz.com',
								subject: 'Matcha account confirmation',
								html: `http://localhost:3000/confirm_email/${emailConfirmationToken}`
							},
							(err, info) => {
								console.log(`http://localhost:3000/confirm_email/${emailConfirmationToken}`)
								if (err) res.status(400).json({ error: err.stack })
								else res.json("Account created successfully, we sent you a mail to confirm your email address, please check your inbox")
							}
						)
					} catch (err) {
						return res.status(400).json({ error: err.message })
					}
				}
			}
		)
	})
})

module.exports = router
// https://ethereal.email/
