const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const validateToken = require('../middlewares/validate_token')
const { isBirthday, isGender } = require('../functions/input_validation')
const fieldIsNullMessage = "One of the fields 'birthday', 'gender', 'sexualPreferences', 'biography' or 'tags' is empty or wasn't sent"

const validateProfileCompletionInput = (req, res, next) => {
    const { birthday, gender, sexualPreferences, biography, tags } = req.body
    if (!birthday || !gender || !sexualPreferences || !biography || !tags) {
        return res.status(422).json({error: {'details': fieldIsNullMessage}})
    } else if (!isBirthday(birthday)){
		return res.status(422).json({error: {"details": "Invalid 'birthday' syntax, should be like YYYY-MM-DD"}})
    } else if (!isGender(gender)){
		return res.status(422).json({error: {"details": "Invalid 'gender' syntax, should be either 'M', 'F' or 'N' (if not specified)"}})
    } else if (!isGender(sexualPreferences)){
		return res.status(422).json({error: {"details": "Invalid 'sexualPreferences' syntax, should be either 'M', 'F' or 'N' (if not specified)"}})
    } else if (tags.length != 5){
		return res.status(422).json({error: {"details": "Invalid 'tags' field, should contain 5 tags"}})
    } else {
        next()
    }
}

router.post('/', validateToken, validateProfileCompletionInput, async (req, res) => {
	const { birthday, gender, sexualPreferences, biography, tags } = req.body
	try {
		let existingTagsArray = []
		let getExistingTagsQuery = "SELECT * FROM tags WHERE value in ("
		
		let insertNewTagsQuery = "INSERT INTO tags(value) VALUES("
		let count = 1;
		for (const tag of tags) {
			count != tags.length ? getExistingTagsQuery += ("'" + tag + "', ") : getExistingTagsQuery += ("'" + tag + "')")
			count++
		}
		dbController.query(
			getExistingTagsQuery,
			(err, result) => {
				if (err) return res.json({error: err}) 
				else {
					existingTagsArray = result
					count = 1
					let tagExists = false
					for (let tag of tags) {
						for (let existingTag of existingTagsArray) {
							if (existingTag.value == tag) tagExists = true
						}
						if (!tagExists) {
							count != existingTagsArray.length ? insertNewTagsQuery += ("'" + tag + "', ") : insertNewTagsQuery += ("'" + tag + "')")
							count++
						}
						tagExists = false
					}
					console.log(insertNewTagsQuery)
					dbController.query(
						"UPDATE users SET " +
							"birthday = ?, " +
							"gender = ?, " +
							"sexualPreferences = ?, " +
							"biography = ? " +
						"WHERE id = ?",
						[birthday, gender, sexualPreferences, biography, req.user.id],
						(err) => {
							if (err) return res.json({error: err})
							else return res.status(200).send('Profile completed successfully')
						}
					)
				}
			}
		)


		
	} catch (err) {
		console.log(err)
		return res.json({ error: err })
	}
})

module.exports = router
