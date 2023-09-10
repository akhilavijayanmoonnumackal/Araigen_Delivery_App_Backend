const Vendor = require('../models/vendorModel');

const createVendor = async (req, res, next) => {
    try {
        const { name, location, contactInformation, email } = req.body;
        const vendor = new Vendor({ name, location, contactInformation, email});
        const savedVendor = await vendor.save();
        res.status(200).json({message:"Vendor Created Successfully",savedVendor});
    } catch (err) {
        console.log(err);
    }
};

const getAllVendors = async(req, res, next) => {
    try {
        const vendors =await Vendor.find({user_id: req.params.id});
        res.json(vendors);
    } catch (err) {
        console.log(err);
    }
};

const getVendorById = async(req, res, next) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if(!vendor) {
            return res.status(404).json({message: `Cannot find any vendor by this ID ${id}`});
        }
        res.status(200).json(vendor);
    } catch(err) {
        console.log(err);
    }
};

const updateVendorById = async(req, res, next) => {
    try {
        const {id} = req.params;
        const updateVendor = await Vendor.findByIdAndUpdate(id, req.body);
        if(!updateVendor) {
            return res.status(404).json({message: `Vendor not found by this ID ${id}`});
        }
        const updatedVendor = await Vendor.findById(id);
        res.status(200).json({message:"Updated Vendor Details Successfully",updatedVendor});
    } catch(err) {
        console.log(err);
    }
};

const deleteVendorById = async(req, res, next) => {
    try {
        const {id} = req.params;
        const deletedVendor = await Vendor.findByIdAndDelete(id);
        if(!deletedVendor) {
            return res.status(404).json({message: `Vendor not found by this Id ${id}`});
        }
        res.status(200).json({message: "Vendor Deleted Successfully"});
    } catch(err) {
        console.log(err);
    }
};

module.exports = { createVendor, getAllVendors, getVendorById, updateVendorById , deleteVendorById};