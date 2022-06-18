const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const validateToken = require('../middlewares/validate_token.js')
const isAccountComplete = require('../middlewares/is_account_complete.js')
const confirmIdentityWithPassword = require('../middlewares/confirm_identity_with_password.js')
const util = require('util')

const getArrayOfUpdatedFields = (body, id) => {
	const { newFirstname, newLastname, newUsername, newEmail, newPassword, newBirthday, newGender, newSexualPreferences, newBiography } = body
	let rtrn = []
	newFirstname != null ? rtrn.push(newFirstname) : 0
	newLastname != null ? rtrn.push(newLastname) : 0
	newUsername != null ? rtrn.push(newUsername) : 0
	newEmail != null ? rtrn.push(newEmail) : 0
	newPassword != null ? rtrn.push(newPassword) : 0
	newBirthday != null ? rtrn.push(newBirthday) : 0
	newGender != null ? rtrn.push(newGender) : 0
	newSexualPreferences != null ? rtrn.push(newSexualPreferences) : 0
	newBiography != null ? rtrn.push(newBiography) : 0
	rtrn.push(id)
	return rtrn
}

const getArrayOfUpdatedTags = (body, id) => {
	const { oldTags, newTags } = body
	let rtrn = []
	for (let i = 0; i < oldTags.length; i++) 
	{
		rtrn.push(newTags[i], id, oldTags[i])
	}
	return rtrn
}

router.post('/', validateToken, confirmIdentityWithPassword, isAccountComplete, async (req, res) => {
	try {
		const queryPromise = util.promisify(dbController.query.bind(dbController))
		const { newFirstname, newLastname, newUsername, newEmail, newPassword, newBirthday, newGender, newSexualPreferences, newBiography, oldTags, newTags} = req.body
		var oldTagsIDs = []
		var newTagsIDs = [] 
		let getExistingTagsQuery = "SELECT * FROM tags WHERE value in ("
		let j
		let count = 1
		/* ************** GETTING OLD TAGS IDs **************** */
		if (newTags != null && oldTags != null) {

			var result = await queryPromise( // get old tags IDs
				"SELECT * FROM tags WHERE " +
					(oldTags.length >= 1 ?    "value = ?" : "") +
					(oldTags.length >= 2 ? "or value = ?" : "") +
					(oldTags.length >= 3 ? "or value = ?" : "") +
					(oldTags.length >= 4 ? "or value = ?" : "") +
					(oldTags.length >= 5 ? "or value = ?" : ""),
				oldTags
			)
		}
		console.log('<-------------------->')
		for (let i = 0 ; i < oldTags.length ; i++) {
			j = 0
			for (; j < result.length ; j++) {
				if (result[j].value == oldTags[i]) {
					oldTagsIDs.push(result[j].id)
				}
			}
		}
		console.log(oldTagsIDs)
		/****************************************************** */
		/**************** GETTING NEW TAGS IDs **************** */
		for (const tag of oldTags) { // setting getExistingTagsQuery to send the query
			count != oldTags.length ? getExistingTagsQuery += ("'" + tag + "', ") : getExistingTagsQuery += ("'" + tag + "')")
			count++
		}
		console.log('get existing tags:' + getExistingTagsQuery)
		result = await queryPromise(getExistingTagsQuery)
		console.log(result)
		if ((newTags.length - result.length) > 0) { // if there are some new tags to add to the DB
			const newTagsLength = newTags.length - result.length
			let tagExists = false
			let firstAddedTagId
			count = 1
			for (let tag of newTags) { // setting newTagsQuery and tagsIds
				for (let existingTag of result) if (existingTag.value == tag) tagExists = true
				if (!tagExists) {
					count != newTagsLength ? insertNewTagsQuery += ("('" + tag + "'), ") : insertNewTagsQuery += ("('" + tag + "')")
					count++
				}
				tagExists = false
			}
			console.log('insert these new tags:' + insertNewTagsQuery)
			result = await queryPromise(insertNewTagsQuery)
			firstAddedTagId = result.insertId
			count = 0
			while (count < newTagsLength) {
				newTagsIDs.push(firstAddedTagId + count)
				count++
			}
			console.log('new tags IDs:' + newTagsIDs)
		}





		/****************************************************** */


		// result = await queryPromise(
		// 	"UPDATE usersTags SET " + 
		// 		"tagId = 5 WHERE uid = 1 AND tagId = oldID"
		// )
	
		// result = await queryPromise(
		// 	"UPDATE users SET " +
		// 		(newFirstname != null ? "firstname = ? " : "") +
		// 		(newLastname != null ? "lastname = ? " : "") +
		// 		(newUsername != null ? "username = ? " : "") +
		// 		(newEmail != null ? "email = ? " : "") +
		// 		(newPassword != null ? "password = ? " : "") +
		// 		(newBirthday != null ? "birthday = ? " : "") +
		// 		(newGender != null ? "gender = ? " : "") +
		// 		(newSexualPreferences != null ? "sexualPreferences = ? " : "") +
		// 		(newBiography != null ? "biography = ? " : "") +
		// 		"WHERE id = ?",
		// 	getArrayOfUpdatedFields(req.body, (req.user[0].id).toString()),
		// )
		res.send("Changes saved successfully")
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err.message })
	}
})

module.exports = router
