const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.post('/', validateToken, isAccountComplete, async (req, res) => {
	const { likedID } = req.body
	try {
		if (req.user.id == likedID) return res.status(400).send("Are you trying to like your own profile ?, sorry this isn't possible")
		var result = await queryPromise( // to see if the user already liked the profile
			"SELECT * FROM likes WHERE uid = ? AND likedID = ?",
			[req.user.id, likedID]
		)
		if (result.length == 0) {
			await queryPromise(
				"INSERT INTO likes(uid, likedID) VALUES(?,?)",
				[req.user.id, likedID],
			)
			await queryPromise( // increment fame rating
				"UPDATE users SET fameRating = fameRating + 1 WHERE id = ?",
				[likedID]
			)
			result = await queryPromise( // to see if both profiles like each other to match them
				"SELECT * FROM likes WHERE uid = ? AND likedID = ?",
				[likedID, req.user.id]
			)
			if (result.length == 0) {
				res.send("Profile liked, persons not matched")
			} else {
				await queryPromise(
					"INSERT INTO matchedUsers(uid1, uid2) VALUES(?,?)",
					[req.user.id, likedID]
				)
				res.send("Profile liked, persons matched")
			}
		} else {
			res.send("Profile already liked")
		}
	} catch (err) {
		res.status(400).json({ error: err })
	}
})

module.exports = router
