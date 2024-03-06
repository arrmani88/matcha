const express = require('express')
const router = express.Router()
const { sign } = require('jsonwebtoken')

const move = async (req, res, next) => {
    try {
        next();
    } catch (error) {
        console.log(error);
        return res.status(400);
    }
}


router.post('/', move, async (req, res) => {
    const accessToken = sign(
        { username: "abdelhamid", id: 1212 },
        process.env.LOGIN_RANDOM_STRING
    )
    // const { password, created_at, updated_at, fameRating, areTagsAdded, ...userPublicData } = result[0]
    res.json({
        "accessToken": accessToken,
    })
})

module.exports = router
