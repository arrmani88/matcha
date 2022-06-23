const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))
const multiparty = require('multiparty')
let nbImagesCanUploadMore

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images')
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
			else cb(null, true)
		}
	}).array('images', nbImagesCanUploadMore)
)

const parseFormDataPromise = util.promisify(
	new multiparty.Form()
)

router.post('/', validateToken, async (req, res) => {
	let isErrorFound = 0
	var receivedImagesCount
	req.newFilesNames = []
	try {
		await parseFormDataPromise.parse(req, (err, fields, files) => {
			if (err) console.log('errrrr' + err)
			else receivedImagesCount = files["images"].length
			console.log('files >>>>>>>>>>>>>\n' + files["images"].length)
		});
		console.log('+++++++++' + receivedImagesCount)
		var result = await queryPromise("SELECT * FROM images WHERE uid = ? AND isProfileImage = 0", req.user.id)
		nbImagesCanUploadMore = 4 - result.length < 0 ? 0 : 4 - result.length
		if (nbImagesCanUploadMore > 0) {
			await multi_upload(req, res)
			for (var index = 0; index < req.files.length && isErrorFound == 0; index++)
				await queryPromise("INSERT INTO images(uid, isProfileImage, image) VALUES(?, ?, ?)", [req.user.id, 0, req.newFilesNames[index]],)
			res.send('Images sent successfully')
		} else {
			res.send(
				nbImagesCanUploadMore != 0 ?
				`You can upload only ${nbImagesCanUploadMore} more images` :
				'You reached the limit of the images that you can upload (4 images), try deleting some images to replace them'
			)
		}
	} catch (err) {
		console.log(err)
		res.status(400).json({ error: err })
	}
})

module.exports = router
