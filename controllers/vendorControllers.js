const Vendor = require('../models/vendorModel');
const { validationResult, body } = require('express-validator');

//create vendor
const createVendor = async (req, res, next) => {
    try {
        await body('name')
        .notEmpty()
        .withMessage('Name is required')
        .run(req);

        await body('location')
        .notEmpty()
        .withMessage('Location is required')
        .run(req);

        await body('contactInformation')
        .notEmpty()
        .withMessage('Contact information is required')
        .run(req);

        await body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .run(req);

        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

        const { name, location, contactInformation, email } = req.body;
        const vendor = new Vendor({ name, location, contactInformation, email});
        const savedVendor = await vendor.save();
        res.status(200).json({ success: true, message:"Vendor Created Successfully",savedVendor});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//to get all vendors
const getAllVendors = async(req, res, next) => {
    try {
        const vendors =await Vendor.find({user_id: req.params.id});
        res.status(200).json({success: true, vendors});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//to get single vendor by ID
const getVendorById = async(req, res, next) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if(!vendor) {
            return res.status(404).json({message: `Cannot find any vendor by this ID ${id}`});
        }
        res.status(200).json({ success: true, vendor});
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//to get update vendor
const updateVendorById = async(req, res, next) => {
    try {
        const {id} = req.params;
        const updateVendor = await Vendor.findByIdAndUpdate(id, req.body);
        if(!updateVendor) {
            return res.status(404).json({message: `Vendor not found by this ID ${id}`});
        }
        const updatedVendor = await Vendor.findById(id);
        res.status(200).json({ success: true, message:"Updated Vendor Details Successfully",updatedVendor});
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//to delete vendor
const deleteVendorById = async(req, res, next) => {
    try {
        const {id} = req.params;
        const deletedVendor = await Vendor.findByIdAndDelete(id);
        if(!deletedVendor) {
            return res.status(404).json({message: `Vendor not found by this Id ${id}`});
        }
        res.status(200).json({ success: true, message: "Vendor Deleted Successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { createVendor, getAllVendors, getVendorById, updateVendorById , deleteVendorById};