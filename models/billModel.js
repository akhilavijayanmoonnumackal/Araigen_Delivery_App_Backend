const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Order',
        required: true,
    },
    billNumber: {
        type: String,
        required: true,
    },
    totalBillAmount: {
        type: Number,
        required: false,
    },
    
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;