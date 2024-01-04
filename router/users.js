const express = require('express');
const router = express.Router();
const {StatusCodes} = require('http-status-codes');
const {
    signup,
    signin,
    requestResetPassword,
    resetPassword
} = require('../controller/controller.users');

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/reset-password', requestResetPassword);

router.put('/reset-password', resetPassword);

module.exports = router;