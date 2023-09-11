const { body, validationResult } = require('express-validator');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { json } = require('express');

const getAllUser = async( req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch(err) {
        console.log(err);
    }
    if(!users) {
        return res.status(404).json({ message: "No Users Found"});
    }
    return res.status(200).json({ users });
};

// const doSignup = async( req, res, next) => {
//     const { name, mobileNumber, password, address, drivingLicenceDetails} = req.body;

//     let existingUser;
//     try {
//         existingUser = await User.findOne({ mobileNumber })
//     } catch(err) {
//         return console.log(err);
//     }
//     if(existingUser) {
//         return res.status(400).json({ message: "User Already Exist! Login Instead.."});
//     }
//     const hashedPassword = bcrypt.hashSync(password);

//     const user = new User ({
//         name,
//         mobileNumber,
//         password: hashedPassword,
//         address,
//         drivingLicenceDetails,
//     });

//     try {
//         await user.save();
//     } catch (err) {
//         console.log(err);
//     }
//     return res.status(201).json({message:"Truck Driver Signup Successfully", user })
// };

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
        await body('drivingLicenceDetails')
        .notEmpty()
        .withMessage('DrivingLicence Number is required')
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
    const hashedPassword = bcrypt.hashSync(password);

    const user = new User ({
        name,
        mobileNumber,
        password: hashedPassword,
        address,
        drivingLicenceDetails,
    });   
        await user.save();
        return res.status(201).json({message:"Truck Driver Signup Successfully", user })
    } catch (err) {
        console.log(err);
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
        return res.status(200).json({message: `Truck Driver ${existingUser.name} LoggedIn Successfully`, accessToken});
        
    } catch (err) {
        console.log(err);
    }
};

module.exports = { getAllUser, doSignup, doLogin }