const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')

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
		console.log('mimetype=' + file.mimetype)
		console.log('filename=' + file.originalname)
		if (file.mimetype != 'image/jpg' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
			return cb("Invalid file type, try uploading a '.jpg', '.jpeg' or a '.png' file")
		} else {
			cb(null, true)
		}
	}
}).array('images', 4)

router.post('/', validateToken, (req, res) => {
	let isErrorFound = 0
	req.newFilesNames = []
	multi_upload(req, res, (err) => {
		console.log(req.newFilesNames)
		if (err) {
			isErrorFound = 1
			res.status(400).json(err).end()
		} else {
			for (var index = 0; index < req.files.length && isErrorFound == 0; index++) {
				dbController.query(
					"INSERT INTO images(uid, isProfileImage, image) VALUES(?, ?, ?)",
					[req.user.id, 0, req.newFilesNames[index]],
					(err) => {
						if (err) {
							isErrorFound = 1
							res.status(400).json({ error: err }).end()
						}
					}
				)
			}
			if (isErrorFound == 0) res.send('images sent successfully').end()
		}
	})
})

module.exports = router
