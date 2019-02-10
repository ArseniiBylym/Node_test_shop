const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get(`/admin/add-products`, adminController.getAddProduct);
router.post(`/admin/add-products`, adminController.postAddProduct);

module.exports = router;
