
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    options: {
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        description: {
            type: String,
            required: true,
        },
        count: {
            type: Number,
            min: 1,
        },
    },

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
