const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))	

router.get('/', validateToken, isAccountComplete, async (req, res) => {
	const { ageMin, ageMax, distance, ratingMin, ratingMax, commonTagsIDs, sort, pageNb, userPerPage } = req.body
	var result = await queryPromise(
		`SELECT users.id, fameRating, ` +
			`firstname, lastname, username, email, city, gender, sexualPreferences, biography, longtitude, latitude,  ` +
			`GROUP_CONCAT(DISTINCT images.image ORDER BY images.image) AS images, \n` +
			`(SELECT COUNT(images.image) FROM images WHERE images.uid = users.id) AS imagesCount, ` +
			`(SELECT count(usersTags.uid) FROM usersTags WHERE usersTags.tagId \n`+
				`IN ('1', '2', 3) \n`+
				`AND usersTags.uid = users.id \n`+
				`GROUP BY usersTags.uid) AS commonTagsCount \n` +
		`FROM users \n` + 
		
		`LEFT JOIN images ON users.id = images.uid \n` +
		`LEFT JOIN usersTags ON users.id = usersTags.uid \n` +
		`LEFT JOIN blocks ON (users.id = blocks.uid OR users.id = blocks.blockedID) \n` +
		// `LEFT JOIN matchedUsers ON (users.id = matchedUsers.uid1 OR users.id = matchedUsers.uid2) \n` +

		`WHERE users.id != ${req.user.id} \n` +
		`AND TIMESTAMPDIFF(YEAR, birthday, CURDATE()) BETWEEN ${ageMin} AND ${ageMax} \n` +
		`AND fameRating BETWEEN ${ratingMin} AND ${ratingMax} \n` + 
		`AND ((users.id != blocks.blockedID AND users.id != blocks.uid) OR blocks.uid IS NULL) \n` +
		// `AND ((users.id != matchedUsers.uid1 AND users.id != matchedUsers.uid2) OR matchedUsers.uid1 IS NULL) \n` +

		// distance
		// unmatched ppl
		// handle sexualPreferences
		`GROUP BY users.id \n` +
		`ORDER BY users.fameRating DESC, ` +
			`commonTagsCount DESC, ` +
			`imagesCount DESC \n` + 
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
