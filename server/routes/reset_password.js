const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { verify, sign } = require("jsonwebtoken");
const dbController = require("../models/db_controller");
const { Router } = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { isPassword } = require("../functions/input_validation");
const e = require("express");

const validatePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password)
      return res.status(422).json({ details: "Password is a required field" });
    else if (!isPassword(password))
      return res
        .status(422)
        .json({ details: "Password should be between 6 ans 20 characters" });
    else next();
  } catch (error) {
    console.log(error);
  }
};

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL_ADDR,
    pass: process.env.EMAIL_PASS,
  },
});

// send email to reset password
router.post("/", (req, res) => {
  const { login } = req.body;
  if (!login)
    return res.status(404).json({ error: "Login is a required field" });
  const resetPasswordToken = sign(
    { login },
    process.env.PASSWORD_RESET_RANDOM_STRING
  );
  dbController.query(
    "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
    [login, login],
    (err, result) => {
      if (err) res.status(400).json({ error: err, description: err.message });
      else if (result.length === 0)
        res.status(404).json({ error: "User not found" });
      else {
        let sentEmail = transporter.sendMail(
          {
            from: process.env.EMAIL_ADDR,
            to: "pirotil826@falkyz.com",
            subject: "Matcha password reset",
            html: `${process.env.CLIENT_HOSTNAME}/reset_password/${resetPasswordToken}`,
          },
          (err, info) => {
            console.log(
              `${process.env.CLIENT_HOSTNAME}/reset_password/${resetPasswordToken}`
            );
            if (err) res.status(400).json({ error: err.stack });
            else
              res.json(
                "An email was sent to your mailbox to reset your password, please check your inbox"
              );
          }
        );
      }
    }
  );
});

// update password in DB
router.post("/:token", validatePassword, (req, res) => {
  const token = req.params.token;
  const { password } = req.body;
  // try {
  const decodedData = verify(token, process.env.PASSWORD_RESET_RANDOM_STRING);
  // } catch (error) {
  // 	return res.status(400).json({
  // 		details :
  // 	})
  // }
  dbController.query(
    "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
    [decodedData.login, decodedData.login],
    (err, result) => {
      if (err) res.status(400).json({ error: err, description: err.message });
      else {
        bcrypt.hash(password, 10).then((hashedPassword) => {
          dbController.query(
            "UPDATE users SET password = ? WHERE username = ? OR email = ?",
            [hashedPassword, decodedData.login, decodedData.login],
            (err) => {
              if (err)
                res.status(400).json({ error: err, description: err.message });
              else {
                const accessToken = sign(
                  { username: result[0].username, id: result[0].id },
                  process.env.LOGIN_RANDOM_STRING
                );
                res.json({ accessToken: accessToken, expires_in: "never" });
              }
            }
          );
        });
      }
    }
  );
});

module.exports = router;
