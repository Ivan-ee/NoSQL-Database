const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    products: {
        type: Array,
        required: true,
    },
    totalAmount: Number,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
