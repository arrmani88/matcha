const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const { sign } = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { isEmail, isUsername, isPassword } = require('../functions/input_validation')

const validateLoginInput = async (req, res, next) => {
    try {
        const { login, password } = req.body
        if (!login || !password) {
            res.status(422)
            return res.json({error: {"details" :"Required ('username' or 'email') and 'password' fields"}})
        }
        else if ((!isUsername(login) && !isEmail(login)) || !isPassword(password)) {
            res.json(422)
            return res.json({error: {"details": "Invalid login or password syntax"}})
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

router.post('/', validateLoginInput, async (req, res) => {
    const { login, password } = req.body
    dbController.query(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [login, login],
        (error, result) => {
            if (error)  return res.json({'error': error})
            else if (result.length == 0) {
                res.status(404)
                return res.json({error: {"details": "User not found"}})
            } else {
                bcrypt.compare(password, result[0].password, (error, isMatched) => {
                    if (error) return res.json({error: error})
                    else if (!isMatched) {
                        res.status(403)
                        return res.send("Wrong password")
                    } else {
                        const accessToken = sign(
                            {username: result[0].username, id: result[0].id},
                            "you just can't guess this random secret string"
                        )
                        res.json({"accessToken": accessToken, "expires_in": "never"})
                    }
                })
            }
            
        }
    )
})

module.exports = router
