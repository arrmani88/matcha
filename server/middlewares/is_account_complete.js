const dbController = require('../models/db_controller')

const isAccountComplete = (req, res, next) => {
	dbController.query(
		"SELECT * FROM users WHERE username =? or OR email =?",
		[login, login],
		(err, result) => {
			if (err) return res.json({ error: err })
			else if (result[0].isAccountConfirmed == 0) {
				return res.status(400).json({ exception: "unconfirmed email address", description: "Please check your email inbox to confirm your email account before performing this action" })
			} else if (result[0].birthday == NULL || result[0].gender == NULL || result[0].sexualPreferences == NULL || result[0].biography == NULL || result[0].tags == NULL) {
				return res.status(400).json({ exception: "incomplete profile", description: "Please complete your profile informations before performing this action" })
			} else {
				next()
			}
		}
	)
}

module.exports = isAccountComplete
