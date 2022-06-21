const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images')
	},
	filename: (req, file, cb) => {
		let newImageName = Date.now() + "_" + 
			crypto.createHash('md5').update(file.originalname).digest('hex') + 
			path.extname(file.originalname)
		req.newFilesNames.push(newImageName)
		cb(null, newImageName)
	},
})

const multi_upload = multer({
	storage,
	limits: { fileSize: 1 * 1024 * 1024 }, //1MB
	fileFilter: (req, file, cb) => {
		if (file.mimetype != 'image/jpg' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
			return cb("Invalid file type, try uploading a '.jpg', '.jpeg' or a '.png' file")
		} else {
			cb(null, true)
		}
	}
}).array('images', 4)

router.post('/', validateToken, async (req, res) => {
	let isErrorFound = 0
	req.newFilesNames = []
	try {
		await multi_upload(req, res, async (err) => {
			if (err) res.status(400).json(err)
			else {
				for (var index = 0; index < req.files.length && isErrorFound == 0; index++) {
					await queryPromise(
						"INSERT INTO images(uid, isProfileImage, image) VALUES(?, ?, ?)",
						[req.user.id, 0, req.newFilesNames[index]],
					)
				}
				res.send('Images sent successfully')
			}
		})
	} catch (err) {
		res.status(400).json({ error: err })
	}
})

module.exports = router
