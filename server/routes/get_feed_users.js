const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.get('/', validateToken, isAccountComplete, (req, res) => {
	const { ageMin, ageMax, distance, ratingMin, ratingMax, sortedCommonTagsIDs, sort, pageNb, userPerPAge } = req.body
	var result = await queryPromise(
		`SELECT * FROM users WHERE `,
		[]
	)
})

module.exports = router