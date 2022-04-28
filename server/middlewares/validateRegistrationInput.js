const { isName, isUsername, isEmail, isPassword } = require("../functions/inputValidation")
const dbController = require("../models/dbController")
const fieldIsNullMessage = "One of the fields 'firstname', 'lastname', 'username', 'email' or 'password' is empty or wasn't sent"

const validateRegistrationInput = (req, res, next) => {
	try {
		const { firstname, lastname, username, email, password } = req.body
		if(!firstname || !lastname || !username || !email || !password) {
			res.status(422)
			return res.json({error: {'details': fieldIsNullMessage}})
		} else if (!isName(firstname)) {
			res.status(422)
			return res.json({error: {"details": "Field 'firstname' isn't valid"}})
		} else if (!isName(lastname)) {
			res.status(422)
			return res.json({error: {"details": "Field 'lastname' isn't valid"}})
		} else if (!isUsername(username)) {
			res.status(422)
			return res.json({error: {"details": "Field 'username' isn't valid"}})
		} else if (!isEmail(email)) {
			res.status(422)
			return res.json({error: {"details": "Field 'email' isn't valid"}})
		} else if (!isPassword(password)) {
			res.status(422)
			return res.json({error: {"details": "Field 'password' should contain minimum 8 characters, at least one letter"}})
		} else {
			dbController.query(
				"SELECT * FROM users WHERE username LIKE ? OR email LIKE ? LIMIT 1",
				[username, email],
				(error, result) => { 
					if (error) return console.log(error)
					console.log('.........................................')
					if (result.length == 0) return next()
				}
			)
		}
	} catch (error) {
		return console.log(error)
	}
}

module.exports = { validateRegistrationInput }
