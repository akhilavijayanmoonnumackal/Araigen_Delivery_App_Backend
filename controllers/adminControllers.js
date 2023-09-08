const { json, response } = require('express');
const Admin = require('../models/adminModel');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

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


const adminLogin = async(req, res, next) => {
    const { email, password } = req.body;
    let existingAdmin;
    try {
        existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) {
            return res.status(400).json({ message: "admin not found" });
        }
    } catch (err) {
        return console.log(err);
    }
   
    const isAdminPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);
    if(!isAdminPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" });
    }
    return res.status(200).json({ message: "Login Successfull" })
};

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
    }
};

const addUser = async(req, res, next) => {
    const { name, email, password, mobileNumber} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email })
    } catch (err) {
        console.log(err);
    }
    if(existingUser) {
        return res.status(400).json({ message: "User already exist! Use Another Email ID..."})
    }
    const hashedPassword = bcrypt.hashSync(password);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        mobileNumber
    });
    try {
        const response = await user.save();
        console.log(response);
        return res.status(200).json({user});
    } catch (err) {
        console.log(err);
    }
};

const getSingleUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        if(!user) {
            return res.status(404).json({ message: `Cannot find any user with ID ${id}`})
        }
        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user) {
            return res.status(404).json({ message: `Cannot find any user with ID ${id}`})
        }
        res.status(200).json(user);
    } catch(err) {
        console.log(err);
    }
}



module.exports = { adminLogin, registerAdmin, getUsers, addUser, getSingleUser, updateUser, deleteUser}