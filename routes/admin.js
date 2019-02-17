const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get(`/admin/add-products`, adminController.getAddProduct);
router.post(`/admin/add-products`, adminController.postAddProduct);
router.post(`/admin/delete-product`, adminController.postDeleteProduct);
router.get(`/admin/edit-product/:productID`, adminController.getEditProduct);
router.post(`/admin/edit-product`, adminController.postEditProduct);

module.exports = router;
