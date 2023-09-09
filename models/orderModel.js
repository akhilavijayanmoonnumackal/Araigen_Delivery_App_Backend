const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    truckDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TruckDriver',
    },
    vendorDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
    },
    totalBillAmount: {
        type: Number,
        required: true,
    },
    collectedAmount: {
        type: Number,
        required: true,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;