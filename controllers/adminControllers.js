const { json, response } = require('express');
const Admin = require('../models/adminModel');
const User = require('../models/UserModel');
const Vendor = require('../models/vendorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerAdmin = async( req, res, next) => {
    const { email, password } = req.body;
    let existingAdmin;
    try {
        existingAdmin = await Admin.findOne({ email })
    } catch(err) {
        return console.log(err);
    }
    if(existingAdmin) {
        res.status(400);
        throw new Error("Admin Already Exists");
    }

    const saltRounds = 10; 
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const admin = await Admin.create({
        email,
        password: hashedPassword,
    });

    if(admin) {
        res.status(201).json({
            _id: admin._id,
            email: admin.email,
            isAdmin: admin.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error('Error Occur');
    }
};


// const adminLogin = async(req, res, next) => {
//     const { email, password } = req.body;
//     let existingAdmin;
//     try {
//         existingAdmin = await Admin.findOne({ email });
//         if (!existingAdmin) {
//             return res.status(400).json({ message: "admin not found" });
//         }
//     } catch (err) {
//         return console.log(err);
//     }
//     const isAdminPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);
//     if(!isAdminPasswordCorrect) {
//         return res.status(400).json({ message: "Incorrect Password" });
//     }
//     return res.status(200).json({ message: "Login Successfull" })
// };

const adminLogin = async(req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error('All fields are required');
    }
    let existingAdmin;
    try {
        existingAdmin = await Admin.findOne({ email });
    } catch (err) {
        return console.log(err);
    }
    if (!existingAdmin) {
        return res.status(400).json({ message: "admin not found" });
    }
    const isAdminPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);
    if(!isAdminPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" });
    }
    try {
        const accessToken = jwt.sign(
            {
                existingAdmin: {
                    isAdmin: existingAdmin.isAdmin,
                    email: existingAdmin.email,
                    id: existingAdmin.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d"},
        );
        console.log("Received token:", accessToken);
        return res.status(200).json({ accessToken});
    } catch (err) {
        console.log(err);
    }
    return res.status(200).json({ message: "Login Successfull" })
};


const createTruckDriver = async(req, res, next) => {
    const { name, mobileNumber, password, address, drivingLicenceDetails} = req.body;
    
    if(!drivingLicenceDetails) {
        return res.status(400).json({message: 'Driving licence details are required'});
    }

    try {
        const existingTruckDriver = await User.findOne({ mobileNumber });
    
    if(existingTruckDriver) {
        return res.status(400).json({ message: "User already exist! Use Another Mobile Number..."})
    }
    const hashedPassword = bcrypt.hashSync(password);

    const truckDriver = new User({
        name,
        mobileNumber,
        password: hashedPassword,
        address,
        drivingLicenceDetails,
    });
        const savedTruckDriver = await truckDriver.save();
        console.log(savedTruckDriver);

        return res.status(200).json({message:'Truck driver created successfully', truckDriver: savedTruckDriver});
    } catch (err) {
        console.log(err);
    }
};

const getAllTruckDrivers = async(req, res, next) => {
    try {
        const truckDrivers = await User.find();
        res.json(truckDrivers);
    } catch(err) {
        console.log(err);
    }
};

const getSingleTruckDriver = async (req, res, next) => {
    try {
        const truckDriver = await User.findById(req.params.id);
        res.status(200).json(truckDriver);
    } catch(err) {
        console.log(err);
    }
};


const updateTruckDriver = async(req, res, next) => {
    try {
        const {id} = req.params;
        const truckDriver = await User.findByIdAndUpdate(id, req.body);
        if(!truckDriver) {
            return res.status(404).json({message: `Cannot find any truck driver with this ID ${id}`});
        }
        const updatedTruckDriver = await User.findById(id);
        res.status(200).json({message:"Truck Driver Details are Updated",updatedTruckDriver});
    } catch (err) {
        console.log(err);
    }
};


const deleteTruckDriver = async(req, res, next) => {
    try {
        const {id} = req.params;
        const truckDriver = await User.findByIdAndDelete(id);
        if(!truckDriver) {
            return tes.status(404).json({ message: `Cannot find any truck driver with ID ${id}`});
        }
        res.status(200).json({message: "Truck Driver Deleted Successfully"});
    } catch (err) {
        console.log(err);
    }
};

// const createVendor = async(req, res, next) => {
//     try {
//         const { name, location, contactInformation, email } = req.body;
//         const vendor = new Vendor({ name, location, contactInformation, email });
//         const savedVendor = await vendor.save();
//         res.status(200).json(savedVendor);
//     }  catch (err) {
//         console.log(err);
//     }
// }


module.exports = { adminLogin, registerAdmin, createTruckDriver, getAllTruckDrivers, getSingleTruckDriver, updateTruckDriver, deleteTruckDriver};