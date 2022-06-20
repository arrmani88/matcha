const dbController = require('../models/db_controller.js')
const bcrypt = require('bcrypt')

const confirmIdentityWithPassword = (req, res, next) => {
	const { username, password } = req.body
	dbController.query(
		"SELECT * FROM users WHERE username = ? LIMIT 1",
		[username],
		(error, result) => {
			if (error)  return res.json({'error': error})
			else {
				bcrypt.compare(password, result[0].password, (error, isMatched) => {
					if (error) return res.json({error: error})
					else if (!isMatched) {
						return res.status(403).send("Wrong password")
					} else {
						req.user = result[0]
						next()
					}
				})
			}
		}
	)
}

module.exports = confirmIdentityWithPassword