const express = require('express');
const authController = require('../controllers/auth');
const {signinValidator} = require('../middleware/validators')

const router = express.Router();

router.get(`/login`, authController.getLogin);
router.post(`/login`, authController.postLogin);

router.get(`/signin`, authController.getSignin);
router.post(`/signin`, signinValidator, authController.postSignin);

router.get('/logout', authController.getLogout);
router.get('/reset', authController.getResetPassword);
router.post('/reset', authController.postResetPassword);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
