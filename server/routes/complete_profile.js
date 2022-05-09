const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const validateToken = require('../middlewares/validate_token')
const validateProfileCompletionInput = require('../middlewares/validate_profile_completion_input')

router.post('/', validateToken, validateProfileCompletionInput, async (req, res) => {
	const { birthday, gender, sexualPreferences, biography } = req.body
	try {
		dbController.query(
			"UPDATE users SET " +
				"birthday = ?, " +
				"gender = ?, " +
				"sexualPreferences = ?, " +
				"biography = ? " +
			"WHERE id = ?",
			[birthday, gender, sexualPreferences, biography, req.user.id],
			(err) => { if (err) return res.json({error: err}) }
		)
	} catch (err) {
		return res.json({error: err})
	}
})

module.exports = router
