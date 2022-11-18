const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.get('/', validateToken, async (req, res) => {
	try {
		const user = await queryPromise("SELECT * FROM users WHERE id = ?", req.user.id)
		const images = await queryPromise('SELECT * FROM images WHERE uid = ?', req.user.id)
		const { password, created_at, updated_at, fameRating, areTagsAdded, ...userPublicData } = user[0]
		res.json({...userPublicData, images})
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err })
	}
})

module.exports = router
