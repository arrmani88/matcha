const express = require('express')
const router = express.Router()
const dbController = require('../models/db_controller')

router.post('/', (req, res) => {
    const { image, extension, owner } = req.body
    console.log(image)
    console.log(extension)
    console.log(owner)
    res.send('ok')
})

module.exports = router
