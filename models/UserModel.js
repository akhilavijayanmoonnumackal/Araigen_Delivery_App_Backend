const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
         name: {
            type: String,
            required: true
         },
         email: {
            type: String,
            required: true,
            unique: true
         },
         password: {
            type: String,
            required: true,
            minlength: 6
         },
         mobileNumber: {
            type: String,
            required: true
         }
    }
);

const TruckDriver = mongoose.model('TruckDriver', userSchema);
module.exports = TruckDriver;