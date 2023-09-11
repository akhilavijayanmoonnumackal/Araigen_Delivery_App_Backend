const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    }],
    truckDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TruckDriver',
        required: true,
    },
    vendorDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    totalBillAmount: {
        type: Number,
        required: true,
    },
    collectedAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending',
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;