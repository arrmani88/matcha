const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.post('/', validateToken, isAccountComplete, async (req, res) => {
	const { unlikedID } = req.body
	try {
		var result = await queryPromise( // to check whether the user already likes the profile or not
			"SELECT * FROM likes WHERE uid = ? AND likedID = ?",
			[req.user.id, unlikedID]
		)
		if (result.length == 1) {
			await queryPromise( // delete the like
				"DELETE FROM likes WHERE uid = ? AND likedID = ?",
				[req.user.id, unlikedID],
			)
			await queryPromise( // decrement fame rating
				"UPDATE users SET fameRating = fameRating - 1 WHERE id = ?",
				[unlikedID]
			)
			result = await queryPromise( // see if both profiles are matched
				"SELECT * FROM matchedUsers WHERE (uid1 = ? AND uid2 = ?) OR (uid1 = ? AND uid2 = ?)",
				[req.user.id, unlikedID, unlikedID, req.user.id]
			)
			if (result.length != 0) {
				await queryPromise( // unmatch the profiles
					"DELETE FROM matchedUsers WHERE (uid1 = ? AND uid2 = ?) OR (uid1 = ? AND uid2 = ?)",
					[req.user.id, unlikedID, unlikedID, req.user.id]
				)
			}
		}
		res.send('Profile unliked successfully')
	} catch (err) {
		res.status(400).json({ error: err })
	}
})

module.exports = router
