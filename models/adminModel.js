const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: true,
    }
});

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;