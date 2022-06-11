const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const validateToken = require('../middlewares/validate_token')
const { isBirthday, isGender } = require('../functions/input_validation')
const { compareSync } = require('bcrypt')
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
		let newTagsIds = []
		let getExistingTagsQuery = "SELECT * FROM tags WHERE value in ("
		let insertNewTagsQuery = "INSERT INTO tags(value) VALUES"
		let count = 1;
		for (const tag of tags) {
			count != tags.length ? getExistingTagsQuery += ("'" + tag + "', ") : getExistingTagsQuery += ("'" + tag + "')")
			count++
		}
		await new Promise(() => {
			dbController.query(
				getExistingTagsQuery,
				(err, result) => {
					if (err) return res.json({ error: err.message }) 
					else if ((tags.length - result.length) > 0) { // if there are some tags to add to the DB
						console.log('444')
						existingTagsArray = result
						const newTagsLength = tags.length - existingTagsArray.length
						let tagExists = false
						let firstAddedTagId
						count = 1
						for (let tag of tags) {
							for (let existingTag of existingTagsArray) if (existingTag.value == tag) tagExists = true
							if (!tagExists) {
								count != newTagsLength ? insertNewTagsQuery += ("('" + tag + "'), ") : insertNewTagsQuery += ("('" + tag + "')")
								count++
							}
							tagExists = false
						}
						dbController.query(
							insertNewTagsQuery,
							(err, result) => {
								console.log('333')
								if (err) res.status(400).json({ error: err })
								else {
									firstAddedTagId = result.insertId
									count = 0
									while (count < newTagsLength) {
										newTagsIds.push(firstAddedTagId + count)
										count++
									}
									// console.log(newTagsIds)
									return (console.log('1111111'))
								}
							}
						)
					}
				}
			)
		})
		console.log('2222')
		// dbController.query(
		// 	"UPDATE users SET " +
		// 		"birthday = ?, " +
		// 		"gender = ?, " +
		// 		"sexualPreferences = ?, " +
		// 		"biography = ? " +
		// 		"WHERE id = ?",
		// 	[birthday, gender, sexualPreferences, biography, req.user.id],
		// 	(err) => {
		// 		if (err) return res.json({error: err})
		// 		else return res.status(200).send('Profile completed successfully')
		// 	}
		// )
	} catch (err) {
		console.log(err)
		return res.json({ error: err })
	}
})

module.exports = router
