const express = require('express')
const router = express.Router()

module.exports = router

router.use('/sp_user', require('./sp_user'))
