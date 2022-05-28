const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')
let newImageName
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

const upload = multer({
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

router.post('/', validateToken, (req, res) => {
	upload(req, res, (err) => {
		if (err) return res.status(400).send({ error: err.message })
		else
			dbController.query(
				"INSERT INTO images(uid, isProfileImage, image) VALUES(?, ?, ?)",
				[req.user.id, 1, newImageName],
				(err) => {
					if (err) res.json({ error: err }).end()
					else res.send('image sent successfully ...')
				}
			)
		}
	)
	
})

module.exports = router
