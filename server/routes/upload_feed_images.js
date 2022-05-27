const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const validateToken = require('../middlewares/validate_token')
const dbController = require('../models/db_controller')

