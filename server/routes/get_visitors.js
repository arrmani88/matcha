const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validate_token");
const dbController = require("../models/db_controller");
const util = require("util");
const queryPromise = util.promisify(dbController.query.bind(dbController));

router.get("/", validateToken, async (req, res) => {
  var ret = [];
  var usr;
  var usrImg;
  var result = await queryPromise(
    `SELECT * FROM visitedProfiles WHERE visited = ${req.user.id}`
  );
  for (var i = 0; i < result.length; i++) {
    usr = await queryPromise(
      `SELECT * FROM users WHERE id = ${result[i].uid} LIMIT 1`
    );
    usrImg = await queryPromise(
      `SELECT * FROM images WHERE uid = ${usr[0].id} AND isProfileImage = 1 LIMIT 1`
    );
    ret.push({
      id: usr[0].id,
      username: usr[0].username,
      firstName: usr[0].firstName,
      lastName: usr[0].lastName,
      profile_image: usrImg[0].image,
      at: result[i].created_at,
    });
  }
  res.json(ret);
});

module.exports = router;
