const express = require("express")
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.post('/', validateToken, isAccountComplete, async (req, res) => {
	const { uid, unblockedID } = req.body
	var result = await queryPromise( // to see if the user already liked the profile
		"SELECT * FROM blocks WHERE id = ? AND blockedID = ?",
		[uid, unblockedID]
	)
	if (result.length == 1) {
		await queryPromise(
			"DELETE FROM blocks WHERE id = ? AND blockedID = ?",
			[uid, unblockedID],
		)
		res.send("Profile blocked successfully")
	} else {
		res.send("Profile already blocked")
	}
})

module.exports = router