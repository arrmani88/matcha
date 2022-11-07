const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')
const validateToken = require('../middlewares/validate_token.js')
const isAccountComplete = require('../middlewares/is_account_complete.js')
const confirmIdentityWithPassword = require('../middlewares/confirm_identity_with_password.js')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))
var oldTagsIDs = []
var newTagsIDs = []
let getExistingTagsQuery = "SELECT * FROM tags WHERE value in ("
let insertNewTagsQuery = "INSERT INTO tags(value) VALUES"
let j
let count = 1

const getArrayOfUpdatedFields = (body, id) => {
	const { newfirstName, newlastName, newUsername, newEmail, newPassword, newBirthday, newCity, newGender, newSexualPreferences, newBiography } = body
	let rtrn = []
	newfirstName != null ? rtrn.push(newfirstName) : 0
	newlastName != null ? rtrn.push(newlastName) : 0
	newUsername != null ? rtrn.push(newUsername) : 0
	newEmail != null ? rtrn.push(newEmail) : 0
	newPassword != null ? rtrn.push(newPassword) : 0
	newBirthday != null ? rtrn.push(newBirthday) : 0
	newCity != null ? rtrn.push(newCity) : 0
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

const getOldTagsIDs = async (oldTags) => {
	oldTagsIDs = []
	var result = await queryPromise( // get old tags IDs
		"SELECT * FROM tags WHERE " +
			(oldTags.length >= 1 ?    "value = ?" : "") +
			(oldTags.length >= 2 ? "or value = ?" : "") +
			(oldTags.length >= 3 ? "or value = ?" : "") +
			(oldTags.length >= 4 ? "or value = ?" : "") +
			(oldTags.length >= 5 ? "or value = ?" : ""),
		oldTags
	)
	for (let i = 0 ; i < oldTags.length ; i++)
		for (j = 0 ; j < result.length ; j++)
			if (result[j].value == oldTags[i])
				oldTagsIDs.push(result[j].id)
	console.log('old tags IDs:' + oldTagsIDs)
}

const getNewTagsIDs = async (newTags) => {
	getExistingTagsQuery = "SELECT * FROM tags WHERE value in ("
	newTagsIDs = []
	count = 1
	for (const tag of newTags) { // setting getExistingTagsQuery to send the query
		count != newTags.length ? getExistingTagsQuery += ("'" + tag + "', ") : getExistingTagsQuery += ("'" + tag + "')")
		count++
	}
	existingTags = await queryPromise(getExistingTagsQuery)
	if ((newTags.length - existingTags.length) > 0) { // if there are some new tags to add to the DB
		const newTagsLength = newTags.length - existingTags.length
		let tagExists = false
		let firstAddedTagId
		count = 1
		insertNewTagsQuery = "INSERT INTO tags(value) VALUES"
		for (let tag of newTags) { // setting newTagsQuery and tagsIds
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
			newTagsIDs.push(firstAddedTagId + count)
			count++
		}
	}
	for (count = 0 ; count < existingTags.length ; count++)
		newTagsIDs.push(existingTags[count].id)
	console.log('new tags ids' + newTagsIDs)
}

const updateUsersTags = async (oldTagsIDs, newTagsIDs, uid) => {
	for (let index = 0 ; index < newTagsIDs.length ; index++) {
		await queryPromise(
			"UPDATE usersTags SET tagID = ? WHERE uid = ? AND tagID = ? LIMIT 1",
			[newTagsIDs[index], uid, oldTagsIDs[index]]
		)
	}
}

router.post('/', confirmIdentityWithPassword, isAccountComplete, async (req, res) => {
	try {
		const { newfirstName, newlastName, newUsername, newEmail, newPassword, newBirthday, newGender, newSexualPreferences, newBiography, oldTags, newTags} = req.body
		if (newTags != null && oldTags != null) {
			await getOldTagsIDs(oldTags)
			await getNewTagsIDs(newTags)
			await updateUsersTags(oldTagsIDs, newTagsIDs, req.user.id)
		}
		result = await queryPromise(
			"UPDATE users SET " +
				(newfirstName != null ? "firstName = ? " : "") +
				(newlastName != null ? "lastName = ? " : "") +
				(newUsername != null ? "username = ? " : "") +
				(newEmail != null ? "email = ? " : "") +
				(newPassword != null ? "password = ? " : "") +
				(newBirthday != null ? "birthday = ? " : "") +
				(newCity != null ? "city = ? " : "") +
				(newGender != null ? "gender = ? " : "") +
				(newSexualPreferences != null ? "sexualPreferences = ? " : "") +
				(newBiography != null ? "biography = ? " : "") +
				"WHERE id = ?",
			getArrayOfUpdatedFields(req.body, (req.user.id).toString()),
		)
		res.send("Changes saved successfully")
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err.message })
	}
})

module.exports = router
