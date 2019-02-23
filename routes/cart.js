const express = require('express');
const cartController = require('../controllers/cart');

const router = express.Router();

router.get(`/cart`, cartController.getUserCart);
router.post(`/cart`, cartController.addToCart);

router.post('/cart/remove-item', cartController.removeFromCart);

router.post('/cart/confirm-order', cartController.comfirmOrder);

module.exports = router;