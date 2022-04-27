const isEmail = require("../tools/isEmail");
const isName = require("../tools/isName");
const isPassword = require("../tools/isPassword");
const isUsername = require("../tools/isUsername");

const validateRegistrationInput = (req, res, next) => {
	const { firstname, lastname, username, email, password } = req.body
	if (!(firstname && lastname && username && email && password &&
	isName(firstname) && isName(lastname) && isUser(username) && isEmail(email) && isPassword(password))) {
		res.status
	}
}