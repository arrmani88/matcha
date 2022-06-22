const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

var newImageName

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images')
	},
	filename: (req, file, cb) => {
		newImageName = Date.now() + "_" + 
			crypto.createHash('md5').update(file.originalname).digest('hex') + 
			path.extname(file.originalname)
		cb(null, newImageName)
	},
})

const upload = util.promisify(
	multer({
		storage: storage,
		limits: { fieldSize: 1 * 1024 * 1024 },
		fileFilter: (req, file, cb) => {
			if (path.extname(file.originalname) != '.jpg' && path.extname(file.originalname) != '.png' && path.extname(file.originalname) != '.jpeg') {
				return cb("Invalid file type, try uploading a '.jpg', '.jpeg' or a '.png' file")
			} else { 
				cb(null, true)
			}
		}
	}).single('image')
)

// router.post('/', validateToken, async (req, res) => {
// 	try {
// 		console.log(req.user.id)
// 	await queryPromise(
// 		"SELECT * FROM images WHERE uid = ? AND isProfileImage = 1",
// 		[req.user.id]
// 	)
// 	upload(req, res, async (err) => {
// 		if (err) return res.status(400).send({ error: err.message })
// 		else await queryPromise(
// 			"INSERT INTO images(uid, isProfileImage, image) VALUES(?, ?, ?)",
// 			[req.user.id, 1, newImageName],
// 		)
// 		}
// 	)
// 	} catch (err) {
// 		console.log(err)
// 	}
// })
// const uploadPromise = util.promisify(upload.bind(upload))
router.post('/', validateToken, async (req, res) => {
	try {
		// var result = await queryPromise( // check if a profile picture already exists, to remplace it
		// 	"SELECT * FROM images WHERE uid = ? AND isProfileImage = 1",
		// 	[req.user.id]
		// )
		console.log('length=' + result.length)
		await upload(
			req, res, (err) => {
				console.log('UPLOADING .....')
				if (err) return res.status(400).send({ error: err.message })
			}
		)
		// upload(req, res, async (err, result) => {
		// 	console.log('UPLOADING .....' + result)
		// 	if (err) return res.status(400).send({ error: err.message })
		// })
		console.log('name=' + newImageName)
			// if (result.length == 0) { // if no profile image was added add one
			// 	console.log(newImageName + '---')
			// 	await queryPromise(
			// 		"INSERT INTO images(uid, isProfileImage, image) VALUES(?, ?, ?)",
			// 		[req.user.id, 1, newImageName],
			// 	)
			// } else { // else if a profile image exists
			// 	console.log(newImageName + '-----')
			// 	await queryPromise(
			// 		"UPDATE images SET image = ? WHERE id = ?",
			// 		[newImageName, result[0].id]
			// 	)
			// }

			res.send("Profile image uploaded successfully")
	} catch (err) {
		console.log(err)
	}
})

module.exports = router
