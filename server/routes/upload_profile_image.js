const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images')
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname))
	},
})

const upload = multer({
	storage: storage,
	limits: { fieldSize: 1000000 },
	fileFilter: (req, file, cb) => {
		if (path.extname(file.originalname) != '.jpg' && path.extname(file.originalname) != '.png' && path.extname(file.originalname) != '.jpeg') {
			return cb(Error("Invalid file type, try uploading a '.jpg', '.jpeg' or a '.png' file"))
		} else {
			cb(null, true)
		}
	}
}).single('profile_image')

const validateToken = require('../middlewares/validate_token')

router.post('/', validateToken, (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			return res.status(400).send({ error: err.message })
		} else {
			res.send('image sent successfully ...')
		}
	})
	
})

module.exports = router
