const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/orders', orderController.createOrder);

router.get('/orders', orderController.getOrders);

router.get('/orders/:id', orderController.getOrderById);

router.put('/orders/:id', orderController.updateOrderById);

router.delete('/orders/:id', orderController.deleteOrderById);

module.exports = router;
