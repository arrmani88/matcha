const { verify } = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    const accessToken = req.header('accessToken')
    if (!accessToken) {
        res.status(401)
        return res.json({"Exception": {"Details": "User not logged in, or no access token was provided in the header"}})
    }
    try {
        const decodedUser = verify(accessToken, "you just can't guess this random secret string")
        if (decodedUser) {
            req.user = decodedUser
            next()
        }
    } catch (err) {
        return res.json({error: err})
    }

}

module.exports = validateToken