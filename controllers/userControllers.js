const { body, validationResult } = require('express-validator');
const User = require('../models/UserModel');
const DrivingLicence = require('../models/drivingLicenceModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { json } = require('express');

//truck driver signup
const doSignup = async( req, res, next) => {
    try {

        //Validaion for name field
        await body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be atleast 2 characters long')
        .run(req);

        //validation for mobile number
        await body('mobileNumber')
        .notEmpty()
        .isMobilePhone(['en-IN'], { strictMode: false})
        .run(req);

        //validation for password
        await body('password')
        .notEmpty()
        .isLength({min:6})
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
        .withMessage('Password must be at least 6 characters long and contain at least one symbol,one number, and one alphabet character')
        .run(req);

        //validation for address
        await body('address')
        .notEmpty().withMessage('Address is required')
        .run(req);

        //validation for driving licence
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
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
    
    const { name, mobileNumber, password, address, drivingLicenceDetails} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ mobileNumber })
    } catch(err) {
        return console.log(err);
    }
    if(existingUser) {
        return res.status(400).json({ message: "User Already Exist! Login Instead.."});
    }
    let drivingLicence = await DrivingLicence.findOne({ number: drivingLicenceDetails.number});
    try {
        if(!drivingLicence) {
            drivingLicence = new DrivingLicence(drivingLicenceDetails);
            await drivingLicence.save();
            } 
        }catch (err) {
            console.log(err);
    }
    const hashedPassword = bcrypt.hashSync(password);

    const user = new User ({
        name,
        mobileNumber,
        password: hashedPassword,
        address,
        drivingLicenceDetails: drivingLicence._id,
    });   
        await user.save();
        return res.status(201).json({ success: true, message:"Truck Driver Signup Successfully", user })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }  
};

const doLogin = async(req, res, next) => {
    const { mobileNumber, password } = req.body;
    if(!mobileNumber || !password) {
        res.status(400),json('Mobile Number aand Password are required!');
    }
    let  existingUser;
    try {
        existingUser = await User.findOne({ mobileNumber });
    } catch (err) {
        return console.log(err);
    }
    if(!existingUser) {
        return res.status(404).json({ message: "User Not Exists in this Mobile Number! Signup Instead.."});
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" });
    }
    try {

        const accessToken = jwt.sign(
            {
                existingUser : {
                    username: existingUser.name,
                    mobileNumber:existingUser.mobileNumber,
                    id: existingUser.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d"}
        );
        console.log("Received token:", accessToken);
        return res.status(200).json({ success: true, message: `Truck Driver ${existingUser.name} LoggedIn Successfully`, accessToken});
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { doSignup, doLogin }