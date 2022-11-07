const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))
const fs = require('fs')
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

router.post('/', validateToken, async (req, res) => {
	try {
		if (!fs.existsSync('./images')) // create the folder /images if it doesn't exist
			fs.mkdirSync('./images')
		var result = await queryPromise( // check if a profile picture already exists, to remplace it
			"SELECT * FROM images WHERE uid = ? AND isProfileImage = 1",
			[req.user.id]
		)
		console.log('length=' + result.length)
		await upload(req, res)
		if (result.length == 0) { // if no profile image was added add one
			await queryPromise(
				"INSERT INTO images(uid, isProfileImage, image) VALUES(?, ?, ?)",
				[req.user.id, 1, newImageName],
			)
		} else { // else if a profile image exists
			if (fs.existsSync(`./images/${result[0].image}`)) { // we know the img exists in the DB, but check if the file exists in the /images folder or has been deleted manually
				fs.unlinkSync(`./images/${result[0].image}`) // delete the image from ./images/
				await queryPromise(
					"UPDATE images SET image = ? WHERE id = ?",
					[newImageName, result[0].id]
				)
			}
		}
		res.send("Profile image upladed successfully")
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err })
	}
})

module.exports = router
