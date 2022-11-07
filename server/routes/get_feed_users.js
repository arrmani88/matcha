const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const isAccountComplete = require('../middlewares/is_account_complete')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))	

router.get('/', validateToken, isAccountComplete, async (req, res) => {
	const { ageMin, ageMax, distance, ratingMin, ratingMax, commonTagsIDs, pageNb, userPerPage } = req.body
	try {
		var result = await queryPromise(
			`SELECT users.id, fameRating, ` +
				`firstName, lastName, username, email, city, gender, sexualPreferences, biography, longitude, latitude, ` +
				`GROUP_CONCAT(DISTINCT images.image ORDER BY images.image) AS images, \n` +
				`(SELECT COUNT(images.image) FROM images WHERE images.uid = users.id) AS imagesCount, ` +
				`(SELECT count(usersTags.uid) FROM usersTags ` +
					`WHERE usersTags.tagID IN ('${commonTagsIDs[0]}', '${commonTagsIDs[1]}', '${commonTagsIDs[2]}', '${commonTagsIDs[3]}', '${commonTagsIDs[4]}') AND usersTags.uid = users.id \n`+
					`GROUP BY usersTags.uid) AS commonTagsCount, \n` +
				`(SELECT ST_Distance_Sphere(point('${req.user.longitude}', '${req.user.latitude}'), point(longitude, latitude)) / 1000) AS distance \n` +
			`FROM users \n` +
	
			`LEFT JOIN images ON users.id = images.uid \n` +
			`LEFT JOIN usersTags ON users.id = usersTags.uid \n` +
			`LEFT JOIN blocks ON (${req.user.id} = blocks.uid OR ${req.user.id} = blocks.blockedID) \n` +
			`LEFT JOIN matchedUsers ON (users.id = matchedUsers.uid1 OR users.id = matchedUsers.uid2) \n` +
	
			`WHERE users.id != ${req.user.id} \n` +
			`AND TIMESTAMPDIFF(YEAR, birthday, CURDATE()) BETWEEN ${ageMin} AND ${ageMax} \n` +
			`AND fameRating BETWEEN ${ratingMin} AND ${ratingMax} \n` + 
			`AND (SELECT COUNT(blocks.id) FROM blocks \n` +
				`WHERE ((users.id = blocks.uid AND ${req.user.id} = blocks.blockedID) \n` +
				`OR (${req.user.id} = blocks.uid AND users.id = blocks.blockedID)) \n` +
				`GROUP BY blocks.id) IS NULL \n` +
			`AND (SELECT COUNT(matchedUsers.id) FROM matchedUsers \n` +
				`WHERE ((users.id = matchedUsers.uid1 AND ${req.user.id} = matchedUsers.uid2) \n` +
				`OR (${req.user.id} = matchedUsers.uid1 AND users.id = matchedUsers.uid2)) \n` +
				`GROUP BY matchedUsers.id) IS NULL \n` +
			`AND '${req.user.sexualPreferences}' LIKE gender \n` +
			`AND (SELECT ST_Distance_Sphere(point('${req.user.longitude}', '${req.user.latitude}'), point(longitude, latitude)) / 1000) \n` +
				`<= ${distance} \n` +
	
			`GROUP BY users.id \n` +
			`ORDER BY users.fameRating DESC, ` +
				`commonTagsCount DESC, ` +
				`imagesCount DESC \n` + 
			`LIMIT ${userPerPage} OFFSET ${(pageNb - 1) * userPerPage} ` +
			``
		)
		res.json(result)
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err })
	}
})

module.exports = router
