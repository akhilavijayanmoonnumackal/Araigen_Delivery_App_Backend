const { body, validationResult } = require('express-validator');
const Admin = require('../models/adminModel');
const User = require('../models/UserModel');
const DrivingLicence = require('../models/drivingLicenceModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//admin registration
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

//admin login
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
    return res.status(200).json({success: true, message: "Login Successfull" })
};

//truck driver management(C)
const createTruckDriver = async (req, res, next, isAdmin = false) => {
    try {

        // Validation for name
        await body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2 })
            .withMessage('Name must be at least 2 characters long')
            .run(req);

        // Validation for mobile number
        await body('mobileNumber')
            .notEmpty()
            .isMobilePhone(['en-IN'], { strictMode: false })
            .run(req);

        // Validation for password
        await body('password')
            .notEmpty()
            .isLength({ min: 6 })
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
            .withMessage('Password must be at least 6 characters long and contain at least one symbol, one number, and one alphabet character')
            .run(req);

        // Validation for address
        await body('address')
            .notEmpty()
            .withMessage('Address is required')
            .run(req);

        // Validation for driving licence 
        await body('drivingLicenceDetails.number')
            .notEmpty()
            .withMessage('Driving License Number is required')
            .custom(async (value) => {
                const regex = /^[A-Z]{2}\d{2}\d{4}\d{7}$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid Driving Licence Number format');
                }
                const existingLicence = await DrivingLicence.findOne({ number: value });
                if (existingLicence) {
                    throw new Error('Driving Licence Number already in use');
                }
                return true;
            })
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, mobileNumber, password, address, drivingLicenceDetails } = req.body;

        let existingUser;
        try {
            existingUser = await User.findOne({ mobileNumber });
        } catch (err) {
            return console.log(err);
        }

        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists! Login Instead.." });
        }

        // Create the driving licence object
        const drivingLicence = new DrivingLicence(drivingLicenceDetails);
        await drivingLicence.save();

        const hashedPassword = bcrypt.hashSync(password);

        const user = new User({
            name,
            mobileNumber,
            password: hashedPassword,
            address,
            drivingLicenceDetails: drivingLicence,
        });

        const savedTruckDriver = await user.save();
        console.log(savedTruckDriver);

        return res.status(200).json({success: true, message:'Truck driver created successfully', truckDriver: savedTruckDriver});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//truck driver management(R)
const getAllTruckDrivers = async(req, res, next) => {
    try {
        const truckDrivers = await User.find().populate('drivingLicenceDetails');
        res.json({ success: true, truckDrivers });
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//truck driver management(R)
const getSingleTruckDriver = async (req, res, next) => {
    try {
        const truckDriver = await User.findById(req.params.id).populate('drivingLicenceDetails');
        res.status(200).json({success: true, truckDriver});
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//truck driver management(U)
const updateTruckDriver = async(req, res, next) => {
    try {
        const {id} = req.params;
        const truckDriver = await User.findByIdAndUpdate(id, req.body);
        if(!truckDriver) {
            return res.status(404).json({message: `Cannot find any truck driver with this ID ${id}`});
        }
        const updatedTruckDriver = await User.findById(id).populate('drivingLicenceDetails');
        res.status(200).json({success: true, message:"Truck Driver Details are Updated",updatedTruckDriver});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//truck driver management(D)
const deleteTruckDriver = async(req, res, next) => {
    try {
        const {id} = req.params;
        const truckDriver = await User.findByIdAndDelete(id);
        if(!truckDriver) {
            return tes.status(404).json({ message: `Cannot find any truck driver with ID ${id}`});
        }
        res.status(200).json({success: true, message: "Truck Driver Deleted Successfully"});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { adminLogin, registerAdmin, createTruckDriver, getAllTruckDrivers, getSingleTruckDriver, updateTruckDriver, deleteTruckDriver};