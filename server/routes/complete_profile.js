const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const validateToken = require('../middlewares/validate_token')
const { isBirthday, isGender } = require('../functions/input_validation')
const fieldIsNullMessage = "One of the fields 'birthday', 'gender', 'sexualPreferences', 'biography' is empty or wasn't sent"

const validateProfileCompletionInput = (req, res, next) => {
    const { birthday, gender, sexualPreferences, biography } = req.body
    if (!birthday || !gender || !sexualPreferences || !biography) {
        res.status(422)
        return res.json({error: {'details': fieldIsNullMessage}})
    } else if (!isBirthday(birthday)){
        res.status(422)
		return res.json({error: {"details": "Invalid 'birthday' syntax, should be like YYYY-MM-DD"}})
    } else if (!isGender(gender)){
        res.status(422)
		return res.json({error: {"details": "Invalid 'gender' syntax, should be either 'M', 'F' or 'N' (if not specified)"}})
    } else if (!isGender(sexualPreferences)){
        res.status(422)
		return res.json({error: {"details": "Invalid 'sexualPreferences' syntax, should be either 'M', 'F' or 'N' (if not specified)"}})
    } else {
        next()
    }
}

router.post('/', validateToken, validateProfileCompletionInput, async (req, res) => {
	const { birthday, gender, sexualPreferences, biography, tags } = req.body
	try {
		console.log(tags)
		let str = "SELECT * FROM tags WHERE value in ("
		let count = 1;
		for (const tag of tags) {
			count != tags.length ? str += ("'" + tag + "', ") : str += ("'" + tag + "'" + ')')
			count++
		}
		console.log(str)
		dbController.query(
			str,
			(err, result) => {
				console.log('---------------------')
				if (err) console.log({ error: err })
				console.log(result[0])
				console.log(result[1])
				console.log(result[2])
				console.log('=====================')
			}
		)
		dbController.query(
			"UPDATE users SET " +
				"birthday = ?, " +
				"gender = ?, " +
				"sexualPreferences = ?, " +
				"biography = ? " +
			"WHERE id = ?",
			[birthday, gender, sexualPreferences, biography, req.user.id],
			(err) => { if (err) return res.json({error: err}) }
		)
		return res.status(200).send('Profile completed successfully')
	} catch (err) {
		return res.json({error: err})
	}
})

module.exports = router
