const { isEmail, isUsername, isPassword } = require('../functions/inputValidation')

const validateLoginInput = (req, res, next) => {
    try {
        const { login, password } = req.body
        if (!login || !password) {
            res.status(422)
            return res.json({error: {"details" :"Required ('username' or 'email') and 'password' fields"}})
        }
        else if ((!isUsername(login) && !isEmail(login)) || !isPassword(password)) {
            res.json(422)
            return res.json({error: {"details": "Invalid coordinates syntax"}})
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { validateLoginInput }