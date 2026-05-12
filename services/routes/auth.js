const express = require('express')
const { signup, login, resetPassword } = require('../controllers/authController')
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/reset', resetPassword)

module.exports = router
