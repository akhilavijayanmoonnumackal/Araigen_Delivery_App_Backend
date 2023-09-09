const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

const doSignup = async( req, res, next) => {
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
    // const user = new User ({
    //     name,
    //     email,
    //     password: hashedPassword,
    //     mobileNumber
    // });

    const user = new User ({
        name,
        mobileNumber,
        password: hashedPassword,
        address,
        drivingLicenceDetails,
    });

    try {
        await user.save();
    } catch (err) {
        console.log(err);
    }
    return res.status(201).json({ user })
};

const doLogin = async(req, res, next) => {
    const { mobileNumber, password } = req.body;
    if(!mobileNumber || !password) {
        res.status(400);
        throw new Error('All fields are mandatory!');
    }
    let  existingUser;
    try {
        existingUser = await User.findOne({ mobileNumber });
    } catch (err) {
        return console.log(err);
    }
    if(!existingUser) {
        return res.status(404).json({ message: "User Not Exists in this Email! Signup Instead.."});
    }

    // const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    // if(!isPasswordCorrect) {
    //     return res.status(400).json({ message: "Incorrect Password" });
    // }
    // return res.status(200).json({ message: "Login Successfull" })

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
        return res.status(200).json({ accessToken});
        
    } catch (err) {
        console.log(err);
    }
}



module.exports = { getAllUser, doSignup, doLogin }