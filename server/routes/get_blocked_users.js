const express = require("express")
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

router.get('/', validateToken, isAccountComplete, async (req, res) => {
	const { uid } = req.body
	try {
		var result = await queryPromise(
			"SELECT * FROM blocks WHERE uid = ?",
			uid
		)
		console.log(result)
		res.send('ok')

	} catch (err) {
		
	}
})

module.exports = router