const { handle } = require('express/lib/application')
const dbController = require('../models/db_controller')

const isAccountComplete = (req, res, next) => {
	dbController.query(
		"SELECT * FROM users WHERE username = ? OR id LIMIT 1",
		[req.body.username, req.body.likerID],
		(err, result) => {
			if (err) return res.json({ error: err })
			else if (result[0].isAccountConfirmed == 0) {
				return res.status(400).json({ exception: "unconfirmed email address", description: "Please check your email inbox to confirm your email account before performing this action" })
			} else if (result[0].birthday == null || result[0].gender == null || result[0].sexualPreferences == null || result[0].biography == null || result[0].areTagsAdded == 0) {
				return res.status(400).json({
					exception: "incomplete profile",
					description: "Please complete your profile informations before performing this action, by filling the following fields: "
						+ (result[0].birthday == null ? "Birthday, " : "")
						+ (result[0].gender == null ? "Gender, " : "")
						+ (result[0].sexualPreferences == null ? "Sexual preferences, " : "")
						+ (result[0].biography == null ? "Biography, " : "")
						+ (result[0].areTagsAdded == 0 ? "Tags" : "")
				})
			} else {
				next()
			}
		}
	)
}

module.exports = isAccountComplete
