const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const validateToken = require('../middlewares/validate_token.js')
const isAccountComplete = require('../middlewares/is_account_complete.js')
const confirmIdentityWithPassword = require('../middlewares/confirm_identity_with_password.js')

const getArrayOfUpdatedFields = () => {
	
}

router.post('/',validateToken,confirmIdentityWithPassword, isAccountComplete,  (req, res) => {
	try {
		const { newFirstname, newLastname, newUsername, newEmail, newPassword, newBirthday, newGender, newSexualPreferences, newBiography } = req.body
		dbController.query(
			"UPDATE users SET" +
				(newFirstname != null ? "firstname = ?" : "") + 
				(newLastname != null ? "lastname = ?" : "") + 
				(newUsername != null ? "username = ?" : "") + 
				(newEmail != null ? "email = ?" : "") + 
				(newPassword != null ? "password = ?" : "") + 
				(newBirthday != null ? "birthday = ?" : "") + 
				(newGender != null ? "gender = ?" : "") + 
				(newSexualPreferences != null ? "sexualPreferences = ?" : "") + 
				(newBiography != null ? "biography = " : "") + 
				"WHERE id = ?",
			[newFirstname, newLastname, newUsername, newEmail, newPassword, newBirthday, newGender, newSexualPreferences, newBiography, req.user.id],
			(err) => { if (err) res.send({ error: err }) }
		)
	} catch (err) {
		res.json({error: err})
	}
})

module.exports = router
