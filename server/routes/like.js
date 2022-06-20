const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.post('/', validateToken, isAccountComplete, async (req, res) => {
	const { likerID, likedID } = req.body
	try {
		var result = await queryPromise( // to see if the user already liked the profile
			"SELECT * FROM likes WHERE likerID = ? AND likedID = ?",
			[likerID, likedID]
		)
		if (result.length == 0) {
			await queryPromise(
				"INSERT INTO likes(likerID, likedID) VALUES(?,?)",
				[likerID, likedID],
			)
			await queryPromise( // increment fame rating
				"UPDATE users SET fameRating = fameRating + 1 WHERE id = ?",
				[likedID]
			)
			result = await queryPromise( // to see if both profiles like each other
				"SELECT * FROM likes WHERE likerID = ? AND likedID = ?",
				[likedID, likerID]
			)
			if (result.length == 0) {
				res.send("Profile liked, persons not matched")
			} else {
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
