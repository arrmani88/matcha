const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const validateToken = require('../middlewares/validate_token')
const { isBirthday, isGender } = require('../functions/input_validation')
const { compareSync } = require('bcrypt')
const fieldIsNullMessage = "One of the fields 'birthday', 'gender', 'sexualPreferences', 'biography' or 'tags' is empty or wasn't sent"
const util = require('util')
var queryPromise = util.promisify(dbController.query.bind(dbController))

const validateProfileCompletionInput = (req, res, next) => {
	const { birthday, gender, sexualPreferences, biography, tags } = req.body
	if (!birthday || !gender || !sexualPreferences || !biography || !tags) {
		return res.status(422).json({ error: { 'details': fieldIsNullMessage } })
	} else if (!isBirthday(birthday)) {
		return res.status(422).json({ error: { "details": "Invalid 'birthday' syntax, should be like YYYY-MM-DD" } })
	} else if (!isGender(gender)) {
		return res.status(422).json({ error: { "details": "Invalid 'gender' syntax, should be either 'M', 'F' or 'N' (if not specified)" } })
	} else if (!isGender(sexualPreferences)) {
		return res.status(422).json({ error: { "details": "Invalid 'sexualPreferences' syntax, should be either 'M', 'F' or 'N' (if not specified)" } })
	} else if (tags.length != 5) {
		return res.status(422).json({ error: { "details": "Invalid 'tags' field, should contain 5 tags" } })
	} else {
		next()
	}
}

router.post('/', validateToken, validateProfileCompletionInput, async (req, res) => {
	const { birthday, gender, sexualPreferences, biography, tags } = req.body
	try {
		let setUsersTagsQuery
		let allTagsIds = []
		let getExistingTagsQuery = "SELECT * FROM tags WHERE value in ("
		let insertNewTagsQuery = "INSERT INTO tags(value) VALUES"
		let result
		let count = 1;
		req.user = (await queryPromise("SELECT * FROM users WHERE id = ?", [req.user.id]))[0]
		if (req.user.areTagsAdded == 0) {
			for (const tag of tags) { // setting getExistingTagsQuery to send the query
				count != tags.length ? getExistingTagsQuery += ("'" + tag + "', ") : getExistingTagsQuery += ("'" + tag + "')")
				count++
			}
			var existingTags = await queryPromise(getExistingTagsQuery)
			if ((tags.length - existingTags.length) > 0) { // if there are some new tags to add to the DB
				const newTagsLength = tags.length - existingTags.length
				let tagExists = false
				let firstAddedTagId
				count = 1
				for (let tag of tags) { // setting newTagsQuery and tagsIds
					for (let existingTag of existingTags) if (existingTag.value == tag) tagExists = true
					if (!tagExists) {
						count != newTagsLength ? insertNewTagsQuery += ("('" + tag + "'), ") : insertNewTagsQuery += ("('" + tag + "')")
						count++
					}
					tagExists = false
				}
				result = await queryPromise(insertNewTagsQuery)
				firstAddedTagId = result.insertId
				count = 0
				while (count < newTagsLength) {
					allTagsIds.push(firstAddedTagId + count)
					count++
				}
			}
			for (count = 0 ; count < existingTags.length ; count++)
				allTagsIds.push(existingTags[count].id)
			setUsersTagsQuery = "INSERT INTO usersTags(uid, tagId) VALUES"
			count = 1
			for (let tag of allTagsIds) {
				setUsersTagsQuery += (count < 5 ? "(" + req.user.id + ", " + tag + ")," : "(" + req.user.id + ", " + tag + ")")
				count++
			}
			result = await queryPromise(setUsersTagsQuery)
		}
		result = await queryPromise(
			"UPDATE users SET birthday = ?, gender = ?, sexualPreferences = ?, biography = ?, areTagsAdded = 1 WHERE id = ?",
			[birthday, gender, sexualPreferences, biography, req.user.id]
		)
		return res.send('Profile completed successfully')
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err })
	}
})


module.exports = router
