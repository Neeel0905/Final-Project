const express = require('express');
const cartItemController = require('../controllers/cartItemController');

const router = express.Router();

router.post('/cart-items', cartItemController.createCartItem);

router.get('/cart-items', cartItemController.getCartItems);

router.get('/cart-items/:id', cartItemController.getCartItemById);

router.put('/cart-items/:id', cartItemController.updateCartItemById);

router.delete('/cart-items/:id', cartItemController.deleteCartItemById);

module.exports = router;
