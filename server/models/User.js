const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['customer', 'admin'], default: 'customer', required: true }
}, { timestamps: true });

const User = model('User', userSchema);

module.exports = User;
