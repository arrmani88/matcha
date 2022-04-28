const isEmail = require("../tools/isEmail");
const isName = require("../tools/isName");
const isPassword = require("../tools/isPassword");
const isUsername = require("../tools/isUsername");

const validateRegistrationInput = (req, res, next) => {
	try {
		const { firstname, lastname, username, email, password } = req.body
	if (!(firstname && lastname && username && email && password &&
	isName(firstname) && isName(lastname) && isUser(username) && isEmail(email) && isPassword(password) && isUsername(username))) {
		res.status(422)
		res.json({error: {'error': 'Invalid input format or one of the fields'}})
	} else {
		return next()
	}
	} catch (error) {
		
	}
}

module.exports = { validateRegistrationInput }
