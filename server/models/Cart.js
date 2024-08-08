const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const cartSchema = new Schema({
    email: { type: String, required: true },
    cartActive: { type: Boolean, default: true }
}, { timestamps: true });

const Cart = model('Cart', cartSchema);

module.exports = Cart;
