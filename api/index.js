const express = require('express')
const router = express.Router()

module.exports = router

router.use('/sp_user', require('./sp_user'))
router.use('/sp_plug', require('./sp_plug'))
router.use('/login', require('./login'))
