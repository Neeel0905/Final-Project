const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const cartItemSchema = new Schema({
    cartID: { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
}, { timestamps: true });

const CartItem = model('CartItem', cartItemSchema);

module.exports = CartItem;
