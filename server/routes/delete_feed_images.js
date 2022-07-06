const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')
const util = require('util')
const queryPromise = util.promisify(dbController.query.bind(dbController))
const fs = require('fs')

router.post('/', validateToken, async (req, res) => {
    try {
        var result = await queryPromise(
            `DELETE FROM images WHERE uid = ${req.user.id} AND isProfileImage = 0 AND image IN (` +
                (req.body.images.length >= 1 ?   "?" : "") + 
                (req.body.images.length >= 2 ? ", ?" : "") +
                (req.body.images.length >= 3 ? ", ?" : "") +
                (req.body.images.length >= 4 ? ", ?" : "") +
                ")",
            req.body.images
        )
        for (var index = 0; index < req.body.images.length; index++)
            fs.unlinkSync(`./images/${req.body.images[index]}`)
        res.send('Images deleted successfully')
    } catch (err) {
        console.log(err)
		res.status(400).json({ error: err })
    }
})

module.exports = router