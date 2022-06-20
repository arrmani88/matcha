const express = require("express")
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.post('/', validateToken, isAccountComplete, async (req, res) => {
	const { uid, blockedID } = req.body
	var result = await queryPromise( // to see if the user already liked the profile
		"SELECT * FROM blocks WHERE uid = ? AND blockedID = ?",
		[uid, blockedID]
	)
	if (result.length == 0) {
		await queryPromise(
			"INSERT INTO blocks(uid, blockedID) VALUES(?,?)",
			[uid, blockedID],
		)
		res.send("Profile blocked successfully")
	} else {
		res.send("Profile already blocked")
	}
})

module.exports = router