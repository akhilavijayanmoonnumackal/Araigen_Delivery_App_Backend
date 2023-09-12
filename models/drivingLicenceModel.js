const mongoose = require('mongoose');

const drivingLicenseSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true,
    },
    issuedBy: {
        type: String,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
});

const DrivingLicence = mongoose.model('DrivingLicence', drivingLicenseSchema);

module.exports = DrivingLicence;