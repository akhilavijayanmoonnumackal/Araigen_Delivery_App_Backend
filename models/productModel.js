const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        producttitle: {
            type: String,
            required: [ true, "Please Enter a Product Name"]
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        },
        categoryname: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
