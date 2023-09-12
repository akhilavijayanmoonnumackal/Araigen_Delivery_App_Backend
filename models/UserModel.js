const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
         name: {
            type: String,
            required: true,
            trim: true,
         },
         mobileNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
         },
         password: {
            type: String,
            required: true,
            minlength: 6
         },
         address: {
            type: String,
            required: true,
         },
         drivingLicenceDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DrivingLicence', 
            required: true,
         }
    }
);

const TruckDriver = mongoose.model('TruckDriver', userSchema);
module.exports = TruckDriver;


