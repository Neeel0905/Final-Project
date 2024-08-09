const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Create a new cart item
exports.createCartItem = async (req, res) => {
    try {
        const { email, productId, quantity } = req.body;

        let cart = await Cart.findOne({ email, cartActive: true });

        if (!cart) {
            cart = new Cart({ email });
            await cart.save();
        }

        let cartItem = await CartItem.findOne({ cartID: cart._id, productId });

        if (cartItem) {
            cartItem.quantity = Math.min(cartItem.quantity + quantity, 10);
        } else {
            cartItem = new CartItem({
                cartID: cart._id,
                productId,
                quantity: Math.min(quantity, 10),
            });
        }

        await cartItem.save();

        res.status(200).json({ message: 'Product added to cart successfully', cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error });
    }
};


// Get all cart items
exports.getCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.find();
        res.status(200).send(cartItems);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a cart item by ID
exports.getCartItemById = async (req, res) => {
    try {
        const cartItem = await CartItem.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).send();
        }
        res.status(200).send(cartItem);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a cart item by ID
exports.updateCartItemById = async (req, res) => {
    try {
        const cartItem = await CartItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!cartItem) {
            return res.status(404).send();
        }
        res.status(200).send(cartItem);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a cart item by ID
exports.deleteCartItemById = async (req, res) => {
    try {
        const cartItem = await CartItem.findByIdAndDelete(req.params.id);
        if (!cartItem) {
            return res.status(404).send();
        }
        res.status(200).send(cartItem);
    } catch (error) {
        res.status(500).send(error);
    }
};
