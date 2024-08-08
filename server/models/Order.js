const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema({
    cartID: { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    postalCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    creditCardNumber: { type: String, required: true },
    nameOnCard: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true }
}, { timestamps: true });

const Order = model('Order', orderSchema);

module.exports = Order;
