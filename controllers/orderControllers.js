const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Bill = require('../models/billModel');
const { validationResult } = require('express-validator'); 

const createOrder = async( req, res, next) => {
    try {   
        const { products, truckDriver, vendorDetails, totalBillAmount, collectedAmount} = req.body;
        const order = new Order({ products, truckDriver, vendorDetails, totalBillAmount, collectedAmount});
        const savedOrder = await order.save();
        const orderId = savedOrder._id;
        // res.status(200).json({orderId});
        res.status(200).json({message:"Order Created", savedOrder, orderId});
    } catch (err) {
        console.log(err);
    }
};

const getAllOrders = async(req, res, next) => {
    try {
        const orders = await Order.find().populate('products').populate('truckDriver').populate('vendorDetails');
        res.status(200).json(orders);
    } catch(err) {
        console.log(err);
    }
};

const getAllOrdersForUser = async(req, res, next) => {
    try {
        const { userId } = req. params;
        const orders = await Order.find({ truckDriver: userId}).populate('products').populate('truckDriver').populate('vendorDetails');
        res.status(200).json(orders);
    } catch(err) {
        console.log(err);
    }
}

const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid input data' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }

        // Get the user from req.user (provided by validateToken middleware)
        const user = req.user; // Change this line
        console.log("User is: ", user);

        // Check if the user is authenticated
        if (!user) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        // Find or create a cart for the user
        let cart = await Cart.findOne({ user: user.id }); // Change this line

        if (!cart) {
            cart = new Cart({ user: user.id, items: [] }); // Change this line
        }

        const existingCartItem = cart.items.find(item => item.product.equals(productId));

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        return res.status(200).json({ message: 'Product added to the cart', cart });
    } catch (err) {
        console.log(err);
    }
};

const finalizeOrderWithBill = async( req, res, next) => {
    try {
        const { orderId, billAmount, paymentStatus } = req.params;
        const order = await Order.findById(orderId);
        if(!order) {
            return res.status(404).json({ message: 'Order not found'});
        }

        const bill = new Bill({ order: orderId, billAmount, paymentStatus});
        await bill.save();
        res.status(200).json(bill);
    } catch (err) {
        console.log(err);
    }
};

const getAllBills = async(req, res, next) => {
    try {
        const bills = await Bill.find().populate('order');
        res.status(200).json(bills);
    } catch(err) {
        console.log(err);
    }
}


module.exports = { createOrder, getAllOrders, addToCart, finalizeOrderWithBill, getAllBills, getAllOrdersForUser };


// const finalizeOrder = (req, res, next) => {
//     const cart = req.sesssion.cart;
//     const bill = new Bill({
//         products: cart,
//         truckDriver: req.user._id,
//     });
//     req.sesssion.cart=[];
//     res.status(200).json({message: 'Order finalized successfully'});
// };

// const addToCart = async(req, res, next) => {
//     try {
//         const {productId, quantity } = req.body;
//         if( !productId || !quantity || isNaN(quantity) || quantity<=0 ) {
//             return res.status(400).json({ message: 'Invalid input data'});
//         }
//         const product = await Product.findById(productId);
//         if(!product) {
//             return res.status(404).json({ message: 'Product Not Found'});
//         }
//         const {id} = req.params;
//         let cart = await Cart.findOne(id);

//         if(!cart) {
//             cart = new Cart({ id, items: []});
//         }

//         const existingCartItem = cart.items.find(item => item.product.equals(productId));

//         if(existingCartItem) {
//             existingCartItem.quantity += quantity;
//         } else {
//             cart.items.push({ product: productId, quantity});
//         }
        
//         await cart.save();

//         return res.status(200).json({ message: 'Product added to the cart', cart})
//     } catch (err) {
//         console.log(err);
//     }
    
// };

// const getAllOrders = async(req, res, next) => {
//     try {
//         const orders = await Order.find().populate('products').populate('truckDriver').populate('vendorDetails');
//         res.status(200).json(orders);
//     } catch(err) {
//         console.log(err);
//     }
// };