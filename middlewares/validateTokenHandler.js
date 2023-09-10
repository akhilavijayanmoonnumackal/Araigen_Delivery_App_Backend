const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Cart = require('../models/cartModel');
const Admin = require('../models/adminModel')


// const validateToken = asyncHandler( async( req, res, next) => {
//     let token;
//     let authHeader = req.headers.Authorization || req.headers.authorization;
//     if( authHeader && authHeader.startsWith("Bearer")) {
//         try {
//             token = authHeader.split(" ")[1];
//             const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//             req.user = await User.findById(decoded.id).select("password");
//             next();
//         } catch(err) {
//             res.status(401);
//             throw new Error("Truck Driver is Not authorized, token failed");
//         }
//     }

//     if(!token) {
//         res.status(401);
//         throw new Error("Truck Driver is Not authorised, no token");
//     }
// });

// const validateToken = asyncHandler( async( req, res, next) => {
//     let token;
//     let authHeader = req.headers.Authorization || req.headers.authorization;
//     if( authHeader && authHeader.startsWith("Bearer")) {
//             token = authHeader.split(" ")[1];
//             jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//                 if(err) {
//                     res.status(401);
//                     throw new Error("Truck Driver is Not authorised");
//                 }
//                 req.user =  decoded.user;
//                 next();
//             });
//             if(!token) {
//                 res.status(401);
//                 throw new Error("Truck Driver is Not authorised, no token");
//             }
//     }
// });

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded JWT: ", decoded);
        req.user = decoded.existingUser;
        console.log("yyyyyyyyyyy", req.user);
        //console.log("User ID:", req.user.id);
        next();
      } catch (err) {
        // const errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }
        console.error(err);
        res.status(401).json({ message: "Truck Driver is Not authorized" });
      }
    } else {
      res.status(401).json({ message: "No token" });
    }
  });

  const validateTokenAdmin = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded JWT: ", decoded);
        req.admin = decoded.existingAdmin;
        console.log("yyyyyyyyyyy", req.admin);
        //console.log("User ID:", req.user.id);
        next();
      } catch (err) {
        // const errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }
        console.error(err);
        res.status(401).json({ message: "Admin is Not authorized" });
      }
    } else {
      res.status(401).json({ message: "No token" });
    }
  });



module.exports = { validateToken, validateTokenAdmin };