const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')

router.post('/', (req, res) => {
	try {
		dbController.query(
			"UPDATE users SET" +
				((firstname != null) ? "firstname = ?" : "") + 
				((lastname != null) ? "lastname = ?" : "") + 
				((username != null) ? "username = ?" : "") + 
				((email != null) ? "email = ?" : "") + 
				((password != null) ? "password = ?" : "") + 
				((birthday != null) ? "birthday = ?" : "") + 
				((gender != null) ? "gender = ?" : "") + 
				((sexualPreferences != null) ? "sexualPreferences = ?" : "") + 
				((biography != null) ? "biography = " : "") + 
				"WHERE id = ?",
			[firstname, lastname, username, email, password, birthday, gender, sexualPreferences, biography, id],
			(err) => { if (err) res.send({ error: err }) }
		)
	} catch (err) {
		res.json({error: err})
	}
})

module.exports = router
