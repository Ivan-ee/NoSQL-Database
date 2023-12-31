const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        desc: {type: String, required: true,},
        categories: {type: Array},
        size: {type: String},
        color: {type: String},
        price: {type: Number, required: true},

    },
    {timestamps: true}
);

ProductSchema.index({ title: 'text' });

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;