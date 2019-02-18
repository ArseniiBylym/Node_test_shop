const express = require('express');
const cartController = require('../controllers/cart');

const router = express.Router();

router.get(`/cart`, cartController.getUserCart);
router.post(`/cart`, cartController.addToCart);

module.exports = router;