const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  isName,
  isUsername,
  isEmail,
  isPassword,
} = require("../functions/input_validation");
const dbController = require("../models/db_controller");
const fieldIsNullMessage =
  "One of the fields 'firstName', 'lastName', 'username', 'email' or 'password' is empty or wasn't sent";

const validateRegistrationInput = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !username || !email || !password) {
      res.status(422);
      return res.json({ error: { details: fieldIsNullMessage } });
    } else if (!isName(firstName)) {
      res.status(422);
      return res.json({ error: { details: "Invalid 'firstName' syntax" } });
    } else if (!isName(lastName)) {
      res.status(422);
      return res.json({ error: { details: "Invalid 'lastName' syntax" } });
    } else if (!isUsername(username)) {
      res.status(422);
      return res.json({ error: { details: "Invalid 'username' syntax" } });
    } else if (!isEmail(email)) {
      res.status(422);
      return res.json({ error: { details: "Invalid 'email' syntax" } });
    } else if (!isPassword(password)) {
      res.status(422);
      return res.json({
        error: { details: "Password should be between 6 and 20 characters" },
      });
    } else {
      dbController.query(
        "SELECT * FROM users WHERE username LIKE ? OR email LIKE ? LIMIT 1",
        [username, email],
        (error, result) => {
          if (error) return console.log(error);
          if (result.length == 0) return next();
          else
            return res.status(409).json({
              Exception: { Details: "Username or email already used" },
            });
        }
      );
    }
  } catch (error) {
    return res.status(400).json(error);
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

router.post("/", validateRegistrationInput, async (req, res) => {
  // router.post("/", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  bcrypt.hash(password, 10).then((hashedPassword) => {
    dbController.query(
      "INSERT INTO users(firstName, lastName, username, email, password) VALUES(?,?,?,?,?);",
      [firstName, lastName, username, email, hashedPassword],
      (error) => {
        if (error) return res.status(400).json(error);
      }
    );
    dbController.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (error, result) => {
        if (error) {
          return res.json({ error: error });
        } else {
          try {
            const emailConfirmationToken = sign(
              { username, id: result[0].id },
              process.env.EMAIL_CONFIRMATION_RANDOM_STRING
            );
            let sentEmail = transporter.sendMail(
              {
                from: "noreply@matcha.com",
                to: process.env.EMAIL_ADDR,
                subject: "Matcha account confirmation",
                html: `${process.env.CLIENT_HOSTNAME}/confirm_email/${emailConfirmationToken}`,
              },
              (err, info) => {
                console.log(
                  `${process.env.CLIENT_HOSTNAME}/confirm_email/${emailConfirmationToken}`
                );
                if (err) res.status(400).json({ error: err.stack });
                else
                  res.json(
                    "Account created successfully, we sent you a mail to confirm your email address, please check your inbox"
                  );
              }
            );
          } catch (err) {
            return res.status(400).json({ error: err.message });
          }
        }
      }
    );
  });
});

module.exports = router;
// https://ethereal.email/
