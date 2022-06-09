const { handle } = require('express/lib/application')
const dbController = require('../models/db_controller')

const isAccountComplete = (req, res, next) => {

	dbController.query(
		"SELECT * FROM users WHERE username =? LIMIT 1",
		[req.body.username],
		(err, result) => {
			if (err) return res.json({ error: err })
			else if (result[0].isAccountConfirmed == 0) {
				return res.status(400).json({ exception: "unconfirmed email address", description: "Please check your email inbox to confirm your email account before performing this action" })
			} else if (result[0].birthday == null || result[0].gender == null || result[0].sexualPreferences == null || result[0].biography == null) {
				return res.status(400).json({ exception: "incomplete profile", description: "Please complete your profile informations before performing this action" })
			} else {
				next()
			}
		}
	)
}

module.exports = isAccountComplete

// handle empty tags field in db: || result[0].tags == null