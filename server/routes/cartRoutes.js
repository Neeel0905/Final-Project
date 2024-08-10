const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/carts', cartController.createCart);

router.get('/carts', cartController.getCarts);

router.get('/carts/:email', cartController.getCartById);

router.put('/carts/:id', cartController.updateCartById);

router.delete('/carts/:id', cartController.deleteCartById);

router.put('/carts/:cartID/status', cartController.updateCartStatus);

module.exports = router;
