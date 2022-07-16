const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))	

router.get('/', validateToken, isAccountComplete, async (req, res) => {
	const { ageMin, ageMax, distance, ratingMin, ratingMax, sortedCommonTagsIDs, sort, pageNb, userPerPage } = req.body
	var result = await queryPromise(
		`SELECT users.id, firstname, lastname, username, email, city, gender, ` +
				`sexualPreferences, biography, longtitude, latitude, fameRating, ` +
				`GROUP_CONCAT(images.image) AS userImages ` +
			`FROM users \n` + 
			`LEFT JOIN images ON users.id = images.uid \n` +
			`WHERE TIMESTAMPDIFF(YEAR, birthday, CURDATE()) BETWEEN ${ageMin} AND ${ageMax} \n` +
			`AND fameRating BETWEEN ${ratingMin} AND ${ratingMax} \n` + 
			// distance
			// unblocked ppl
			// unmatched ppl
			`GROUP BY users.id \n` +
			`ORDER BY LENGTH(GROUP_CONCAT(images.image)) ASC \n` + 
			`LIMIT ${userPerPage} OFFSET ${(pageNb - 1) * userPerPage} ` + 
			``
	)
	console.log(result)
	console.log("length=" + result.length)
	res.send('ok')
})

module.exports = router

// `SELECT users.id, users.fameRating, \n`+
// `(SELECT count(usersTags.uid) FROM usersTags WHERE usersTags.tagId \n`+
// `IN ('1', '2', 3)\n`+
// `AND usersTags.uid = users.id `+
// `GROUP BY usersTags.uid) AS commonTags FROM users \n` +
// `LEFT JOIN usersTags ON users.id = usersTags.uid \n` +
// `GROUP BY users.id \n` +
// `ORDER BY users.fameRating DESC, commonTags DESC \n` +
// ``

// "SELECT *, GROUP_CONCAT(images.image) AS userImages FROM users LEFT JOIN images ON users.id = images.uid " + "GROUP BY users.id
