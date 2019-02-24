const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.get(`/cart`, userController.getUserCart);
router.post(`/cart`, userController.addToCart);

router.post('/cart/remove-item', userController.removeFromCart);

router.post('/cart/confirm-order', userController.comfirmOrder);
router.get('/orders', userController.getUserOrders);

module.exports = router;