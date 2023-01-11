const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const { sign } = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { isEmail, isUsername, isPassword } = require('../functions/input_validation')

const validateLoginInput = async (req, res, next) => {
	try {
		const { login, password } = req.body
		if (!login || !password) {
			res.status(422)
			return res.json({ error: { "details": "Required login ('username' or 'email') and 'password' fields" } })
		}
		else if ((!isUsername(login) && !isEmail(login)) || !isPassword(password)) {
			res.status(422)
			return res.json({ error: { "details": "Invalid login or password syntax" } })
		} else {
			next()
		}
	} catch (error) {
		console.log(error)
	}
}

router.post('/', validateLoginInput, async (req, res) => {
	const { login, password } = req.body
	dbController.query(
		"SELECT * FROM users WHERE username = ? OR email = ?",
		[login, login],
		(error, result) => {
			if (error) return res.json({ 'error': error })
			else if (result.length == 0) {
				res.status(404)
				return res.json({ error: { "details": "User not found" } })
			} else {
				if (result[0].isAccountConfirmed == 0) {
					return res.status(422).json({ exception: "You didn't confirme your email address yet, please check your inbox to confirm your account" })
				}
				bcrypt.compare(password, result[0].password, (error, isMatched) => {
					if (error) return res.json({ error: error })
					else if (!isMatched) {
						res.status(403)
						return res.send("Wrong password")
					} else {
						dbController.query(
							'SELECT * FROM images WHERE uid = ?',
							result[0].id,
							(error, images) => {
								if (error) return res.status(400).json({ error })
								const accessToken = sign(
									{ username: result[0].username, id: result[0].id },
									process.env.LOGIN_RANDOM_STRING
								)
								const { password, created_at, updated_at, fameRating, areTagsAdded, ...userPublicData } = result[0]
								res.json({
									"accessToken": accessToken,
									...userPublicData,
                                    images: images
								})
							}
						)
					}
				})
			}
		}
	)
})

module.exports = router
