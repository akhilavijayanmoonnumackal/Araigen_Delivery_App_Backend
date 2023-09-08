const Admin = require('../models/adminModel');
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

module.exports = { adminLogin, registerAdmin}