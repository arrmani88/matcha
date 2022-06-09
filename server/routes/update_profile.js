const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const validateToken = require('../middlewares/validate_token.js')
const isAccountComplete = require('../middlewares/is_account_complete.js')
const confirmIdentityWithPassword = require('../middlewares/confirm_identity_with_password.js')

const getArrayOfUpdatedFields = (body, id) => {
	const { newFirstname, newLastname, newUsername, newEmail, newPassword, newBirthday, newGender, newSexualPreferences, newBiography } = body
	result = []
	newFirstname != null ? result.push(newFirstname) : 0
	newLastname != null ? result.push(newLastname) : 0
	newUsername != null ? result.push(newUsername) : 0
	newEmail != null ? result.push(newEmail) : 0
	newPassword != null ? result.push(newPassword) : 0
	newBirthday != null ? result.push(newBirthday) : 0
	newGender != null ? result.push(newGender) : 0
	newSexualPreferences != null ? result.push(newSexualPreferences) : 0
	newBiography != null ? result.push(newBiography) : 0
	result.push(id)
	return result
}

router.post('/', validateToken, confirmIdentityWithPassword, isAccountComplete, (req, res) => {
	try {
		const { newFirstname, newLastname, newUsername, newEmail, newPassword, newBirthday, newGender, newSexualPreferences, newBiography } = req.body
		dbController.query(
			"UPDATE users SET " +
				(newFirstname != null ? "firstname = ? " : "") + 
				(newLastname != null ? "lastname = ? " : "") + 
				(newUsername != null ? "username = ? " : "") + 
				(newEmail != null ? "email = ? " : "") + 
				(newPassword != null ? "password = ? " : "") + 
				(newBirthday != null ? "birthday = ? " : "") + 
				(newGender != null ? "gender = ? " : "") + 
				(newSexualPreferences != null ? "sexualPreferences = ? " : "") + 
				(newBiography != null ? "biography = ? " : "") + 
				"WHERE id = ?",
			getArrayOfUpdatedFields(req.body, (req.user[0].id).toString()),
			(err) => { 
				if (err) res.json({ error: err })
				else {
					res.send("Changes saved successfully")
				}
			}
		)
	} catch (err) {
		res.json({ error: err.message })
	}
})

module.exports = router
