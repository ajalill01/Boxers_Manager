const express = require('express')
const {
    login
} = require('../controllers/auth-controllers') 


const router = express.Router()

router.post('/login',login)


module.exports = router