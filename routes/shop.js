const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get(`/`, shopController.getHomePage);
router.get(`/products`, shopController.getProducts);
router.get(`/products/:id`, shopController.getProductItem);

module.exports = router;
