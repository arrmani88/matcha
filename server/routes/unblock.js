const express = require("express")
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.post('/', validateToken, isAccountComplete, async (req, res) => {
	const { unblockedID } = req.body
	try {
		await queryPromise(
			"DELETE FROM blocks WHERE uid = ? AND blockedID = ?",
			[req.user.id, unblockedID],
		)
		res.send("Profile unblocked successfully")
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err })
	}
})

module.exports = router