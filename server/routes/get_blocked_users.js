const express = require("express")
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

const getArrayOfIDs = async (result) => {
	var rtrn = []
	var tmpUser
	var tmpImg
	for (let index = 0 ; index < result.length ; index++) {
		tmpUser = (await queryPromise(
			"SELECT * FROM users WHERE id = ?",
			result[index].blockedID
		))[0]
		tmpImg = (await queryPromise(
			"SELECT * FROM images WHERE uid = ? AND isProfileImage = 1",
			tmpUser.id
		))[0].image
		rtrn.push({
			id: tmpUser.id,
			firstName: tmpUser.firstName,
			lastName: tmpUser.lastName,
			username: tmpUser.username,
			profileImage: tmpImg
		})
	}
	return rtrn
}

router.get('/', validateToken, isAccountComplete, async (req, res) => {
	try {
		var result = await queryPromise(
			"SELECT * FROM blocks WHERE uid = ?",
			req.user.id
		)
		res.send(await getArrayOfIDs(result))
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err })
	}
})

module.exports = router