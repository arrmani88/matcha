const express = require("express")
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.post('/', validateToken, isAccountComplete, async (req, res) => {
	const { uid, blockedID } = req.body
	try {
		if (uid == blockedID) return res.status(400).send("Are you trying to block yourself ?")
		var result = await queryPromise( // to see if the user already liked the profile
			"SELECT * FROM blocks WHERE uid = ? AND blockedID = ?",
			[uid, blockedID]
		)
		if (result.length == 0) {
			await queryPromise( // set profile as blocked in `blocks`
				"INSERT INTO blocks(uid, blockedID) VALUES(?,?)",
				[uid, blockedID],
			)
			await queryPromise( // removing the likes
				"DELETE FROM likes WHERE likerID = ? AND likedID = ?",
				[uid, blockedID]
			)
			await queryPromise( // removing the likes
				"DELETE FROM likes WHERE likerID = ? AND likedID = ?",
				[blockedID, uid]
			)
			await queryPromise( // unmatch the profiles
				"DELETE FROM matchedUsers WHERE (uid1 = ? AND uid2 = ?) OR (uid1 = ? AND uid2 = ?)",
				[uid, blockedID, blockedID, uid]
			)
			res.send("Profile blocked successfully")
		} else {
			res.send("Profile already blocked")
		}
	} catch (err) {
		res.status(400).json({ error: err })
	}
})

module.exports = router
