const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

// Create a new cart
exports.createCart = async (req, res) => {
    try {
        const cart = new Cart(req.body);
        await cart.save();
        res.status(201).send(cart);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all carts
exports.getCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).send(carts);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getCartById = async (req, res) => {
    try {
        const { email } = req.params;

        let cart = await Cart.findOne({ email, cartActive: true });

        if (!cart) {
            cart = new Cart({ email });
            await cart.save();
        }

        const cartItems = await CartItem.find({ cartID: cart._id }).populate('productId');

        // Calculate subtotal
        const subtotal = cartItems.reduce((acc, item) => {
            return acc + item.productId.price * item.quantity;
        }, 0);

        // Calculate tax (13% of subtotal)
        const tax = subtotal * 0.13;

        // Calculate total (subtotal + tax)
        const total = subtotal + tax;

        res.status(200).json({ cart, cartItems, subtotal, tax, total });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving or creating cart', error });
    }
};

exports.updateCartStatus = async (req, res) => {
  try {
    const { cartID } = req.params;
    const { cartActive } = req.body;

    const cart = await Cart.findByIdAndUpdate(cartID, { cartActive }, { new: true });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart status updated successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart status', error });
  }
};


// Update a cart by ID
exports.updateCartById = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!cart) {
            return res.status(404).send();
        }
        res.status(200).send(cart);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a cart by ID
exports.deleteCartById = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        if (!cart) {
            return res.status(404).send();
        }
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send(error);
    }
};
