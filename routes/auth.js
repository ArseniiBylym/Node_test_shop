const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get(`/login`, authController.getLogin);
router.post(`/login`, authController.postLogin);

router.get(`/signin`, authController.getSignin);
router.post(`/signin`, authController.postSignin);

router.get('/logout', authController.getLogout);

module.exports = router;
