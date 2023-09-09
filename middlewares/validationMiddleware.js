const { body, validationResult} = require('express-validator');
const Product = require('../models/productModel');
const TruckDriver = require('../models/UserModel');
const Vendor = require('../models/vendorModel');

const orderValidationRules = [

    //validate products
    body('products').isArray({min:1}).withMessage('Atleast one product is required')
    .custom((value) => {
        if(!value.every((productId) => isValidProductId(productId))) {
            throw new Error('Invalid product ID');
        } 
        return true;
    }),

    //validate truck driver
    body('truckDriver').isMongoId().withMessage('Invalid truck driver ID')
    .custom((value) => {
        if(!isValidTruckDriverId(value)) {
            throw new Error('Invalid truck driver ID');
        } 
        return true;
    }),

    //validate vendor details
    body('vendorDetails').isMongoId().withMessage('Invalid vendor details ID')
    .custom((value) => {
        if(!isValidVendorId(value)) {
            throw new Error('Invalid vendor details ID');
        }
        return true;
    }),


    //validate tottalBillAmount
    body('totalBillAmount').isNumeric().withMessage('Total Bill Amount must be a number')
    .isFloat({min:0}).withMessage('Total bill amount must be a positive number'),

    //validate collectedAmount
    body('collectedAmount').isNumeric().withMessage('Collected amount must be a number')
    .isFloat({min:0}).withMessage('Collected amount must be a positive number'),
];

const isValidProductId = async (productId) => {
    try {
        const product = await Product.findById(productId)
        return !!product;
    } catch(err) {
        console.log(err);
        return false;
    }
};

const isValidTruckDriverId = async(truckDriverId) => {
    try {
        const truckDriver = await TruckDriver.findById(truckDriverId);
        return !!truckDriver;
    } catch(err) {
        console.log(err);
        return false;
    }
};

const isValidVendorId = async(VendorId) => {
    try {
        const vendor = await Vendor.findById(VendorId);
        return !!vendor;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map((err)=>extractedErrors.push({ [err.param]: err.msg }));

    return res.this.status(422).json({ errors: extractedErrors });
};

module.exports = { orderValidationRules, validate };