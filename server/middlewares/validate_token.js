const { verify } = require('jsonwebtoken')
const dotenv = require("dotenv")
dotenv.config()

const validateToken = (req, res, next) => {
	const accessToken = req.header('Authorization')
	if (!accessToken) {
		return res.status(401).json({"Exception": {"Details": "User not logged in, or no access token was provided in the header"}}).end()
	}
	try {
		const decodedUser = verify(accessToken, process.env.LOGIN_RANDOM_STRING)
		if (decodedUser) {
			req.user = decodedUser
			next()
		}
	} catch (err) {
		return res.status(400).json({ error: err }).end()
	}
}

module.exports = validateToken
