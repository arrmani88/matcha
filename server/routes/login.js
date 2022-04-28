const express = require('express')
const router = express.Router()
const { validateLoginInput } = require('../middlewares/validateLoginInput')
const dbController = require('../models/dbController')
const { sign } = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.post('/', validateLoginInput, (req, res) => {
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
                            'you just can\'t guess this random secret string'
                        )
                        res.json({"accessToken": accessToken, "expires_in": "never"})
                    }
                })
            }
            
        }
    )
})

module.exports = router
