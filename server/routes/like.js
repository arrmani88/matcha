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
		var result = await queryPromise(
			"SELECT * FROM likes WHERE likerID = ? AND likedID = ?",
			[likerID, likedID]
		)
		if (result.length == 0) {
			await queryPromise(
				"INSERT INTO likes(likerID, likedID) VALUES(?,?)",
				[likerID, likedID],
			)
			await queryPromise(
				"UPDATE users SET fameRating = fameRating + 1 WHERE id = ?",
				[likedID]
			)
		}
		res.send('done')
	} catch (err) {
		res.status(400).json({ error: err })
	}
})

module.exports = router
