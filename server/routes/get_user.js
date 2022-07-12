const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.get('/', validateToken, async (req, res) => {
    try {
        const { id } = req.body
        const result = await queryPromise(
            "SELECT * FROM users WHERE id = ?",
            id
        )
        if (result.length) {
            res.json({
                id: result[0].id,
                firstname: result[0].firstname,
                lastname : result[0].lastname,
                username : result[0].username,
                email : result[0].email,
                birthday : result[0].birthday,
                city : result[0].city,
                gender : result[0].gender,
                sexualPreferences: result[0].sexualPreferences,
                biography: result[0].biography,
                longtitude: result[0].longtitude,
                latitude: result[0].latitude,
            })
            if (id != req.user.id) {
                await queryPromise(
                    "INSERT INTO visitedProfiles(visited, visitor) VALUES(?, ?)",
                    [id, req.user.id]
                )
            }
        } else {
            res.json({ "Exception": "No user with the given id was found" })
        }
    } catch (err) {
        console.log(err)
		res.status(400).json({ error: err })
    }
})

module.exports = router