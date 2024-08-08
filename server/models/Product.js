const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    longDescription: { type: String },
    productImage: { type: String },
    category: { type: String, required: true }
}, { timestamps: true });

const Product = model('Product', productSchema);

module.exports = Product;
