const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get(`/add-products`, adminController.getAddProduct);
router.post(`/add-products`, adminController.postAddProduct);
router.post(`/delete-product`, adminController.postDeleteProduct);
router.get(`/edit-product/:productID`, adminController.getEditProduct);
router.post(`/edit-product`, adminController.postEditProduct);
router.get('/all-orders', adminController.getAllOrders);
router.post('/all-orders/:id', adminController.changeOrderStatus);

module.exports = router;
