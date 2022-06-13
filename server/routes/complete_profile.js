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
		let usersTagsQuery
		let allTagsIds = []
		let getExistingTagsQuery = "SELECT * FROM tags WHERE value in ("
		let newTagsQuery = "INSERT INTO tags(value) VALUES"
		let count = 1;
		for (const tag of tags) {
			count != tags.length ? getExistingTagsQuery += ("'" + tag + "', ") : getExistingTagsQuery += ("'" + tag + "')")
			count++
		}
		await new Promise((res, rej) => {
			dbController.query(
				getExistingTagsQuery,
				(err, result) => {
					if (err) return rej(err)
					else {
						for (let existingTag of result) allTagsIds.push(existingTag.id)
						if ((tags.length - result.length) > 0) { // if there are some new tags to add to the DB
							const newTagsLength = tags.length - result.length
							let tagExists = false
							let firstAddedTagId
							count = 1
							for (let tag of tags) { // setting newTagsQuery and tagsIds
								for (let existingTag of result) if (existingTag.value == tag) tagExists = true
								if (!tagExists) {
									count != newTagsLength ? newTagsQuery += ("('" + tag + "'), ") : newTagsQuery += ("('" + tag + "')")
									count++
								}
								tagExists = false
							}
							dbController.query(
								newTagsQuery,
								(err, result) => {
									if (err) rej(err)
									else {
										firstAddedTagId = result.insertId
										count = 0
										while (count < newTagsLength) {
											allTagsIds.push(firstAddedTagId + count)
											count++
										}
									}
								}
							)
						}
						console.log('1>>' + allTagsIds + '<<')
					}
				}
			)
			res('')
		})
		console.log('2>>' + allTagsIds + '<<')
		

		// await new Promise((res, rej) => {
		// 	usersTagsQuery = "INSERT INTO usersTags(uid, tagId) VALUES"
		// 	count = 1
		// 	for (let tag of allTagsIds) {
		// 		usersTagsQuery += (count < 5 ? "('" + tag + "')," : "('" + tag + "')")
		// 		count++
		// 	}
		// 	console.log(usersTagsQuery)
		// 	res('')
			// dbController.query(
			// 	"INSERT INTO usersTags(uid, tagId) VALUES",
			// 	(err, result) => {

			// 	}
			// )
		// })


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

		res.send('finished')
	} catch (err) {
		console.log(err)
		return res.json({ error: err })
	}
})

module.exports = router
