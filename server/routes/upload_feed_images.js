const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')
const fs = require('fs')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))
var nbImagesCanUploadMore
var receivedImagesCount

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'parsed_images')
	},
	filename: (req, file, cb) => {
		let newImageName = Date.now() + "_" + crypto.createHash('md5').update(file.originalname).digest('hex') + path.extname(file.originalname)
		req.newFilesNames.push(newImageName)
		cb(null, newImageName)
	},
})
const multi_upload = util.promisify(
	multer({
		storage,
		limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
		fileFilter: (req, file, cb) => {
			if (file.mimetype != 'image/jpg' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/png')
				return cb("Invalid file type, try uploading a '.jpg', '.jpeg' or a '.png' file")
			else {
				receivedImagesCount++
				cb(null, true)
			}
		}
	}).array('images', 4)
)

router.post('/', validateToken, async (req, res) => {
	receivedImagesCount = 0
	req.newFilesNames = []
	try {
		if (!fs.existsSync('./images')) fs.mkdirSync('./images')
		if (!fs.existsSync('./parsed_images')) fs.mkdirSync('./parsed_images')
		// upload the images to ./parsed_images
		await multi_upload(req, res)
		// query how many images the user has
		var result = await queryPromise("SELECT * FROM images WHERE uid = ? AND isProfileImage = 0", req.user.id)
		nbImagesCanUploadMore = 4 - result.length < 0 ? 0 : 4 - result.length
		// if the user can upload more images
		if (nbImagesCanUploadMore > 0 && receivedImagesCount <= nbImagesCanUploadMore) {
			for (var index = 0; index < req.files.length ; index++) {
				// move the images from './parsed_images to ./images
				fs.rename(`./parsed_images/${req.newFilesNames[index]}`, `./images/${req.newFilesNames[index]}`, (err) => {if (err) throw err })
				await queryPromise("INSERT INTO images(uid, isProfileImage, image) VALUES(?, ?, ?)", [req.user.id, 0, req.newFilesNames[index]],)
			}
			res.send('Images sent successfully')
		} else {
			for (var index = 0; index < req.files.length ; index++)
				// delete the images from ./parsed_images
				fs.unlinkSync(`./parsed_images/${req.newFilesNames[index]}`)
			res.send(nbImagesCanUploadMore != 0 ? `You can upload only ${nbImagesCanUploadMore} more images` : 'You reached the limit of the images that you can upload (4 images), try deleting some images to replace them')
		}
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err })
	}
})

module.exports = router
