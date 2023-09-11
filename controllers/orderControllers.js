const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Bill = require('../models/billModel');
const { validationResult } = require('express-validator'); 
const { generateBillNumber } = require('../utils/billUtils');

//order management(C)
const createOrder = async(req, res, next) => {
    try {
        const { products, truckDriver, vendorDetails, totalBillAmount, collectedAmount, status } = req.body;
        if(!Array.isArray(products) || products.some(item => !item.product || isNaN(item.quantity))) {
            return res.status(400).json({ message: 'Invalid Product Details'});
        }
        const order = new Order({ products, truckDriver, vendorDetails, totalBillAmount, collectedAmount });
        const savedOrder = await order.save();
        res.status(200).json({message: "Order Created", savedOrder});
    } catch (err) {
        console.log(err);
    }
}

//order management(R)
const getAllOrders = async(req, res, next) => {
    try {
        const orders = await Order.find().populate({
            path: 'products.product',
            model: 'Product',
        })
        .populate('truckDriver')
        .populate('vendorDetails');
        res.status(200).json(orders);
    } catch(err) {
        console.log(err);
    }
}

//truck driver all orders
const getAllOrdersForTruckDriver = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const userName = req.user.username;
        console.log("Userid: ",userId);
        const orders = await Order.find({truckDriver: userId })
        .populate({
            path: 'products.product',
            model: 'Product',
        })
        .populate('vendorDetails');

        if(orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this Truck Driver.'});
        }
        console.log("Orders: ", orders);
        res.status(200).json({message: `${userName}'s Orders: `,orders});
    } catch(err) {
        console.log(err);
    }
};

//add to cart based on order
const addToCart = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { items} = req.body;
        const user = req.user;
        
        let order = await Order.findById(orderId);

        if(!order || order.truckDriver.toString() !== user.id.toString()) {
            return res.status(401).json({ message: 'Unauthorized. This is not your order!!!'});
        }

        let cart = await Cart.findOne({ user: user.id, order: orderId });
        if (!cart) {
            cart = new Cart({ user: user.id, order: orderId, items: [] });
        }
        for(const item of items) {
            const { productId, quantity } = item;

            const product = await Product.findById(productId);
            if(!product) {
                return res.status(404).json({message: 'Product not found'});
            }
            cart.items.push({ 
                product: productId, 
                quantity,
                price: product.price,
            });
        }
            await cart.save();
            console.log('Cart Items:', cart.items);
            res.status(200).json({ message: 'Product added to the cart', cart });
        

        // if (!cart) {
        //     cart = new Cart({ user: user.id, order: orderId, items: [] });
        // }

        
    } catch (err) {
        console.log(err);
    }
};

const getCartItemsForTruckDriver = async(req, res, next) => {
    try {
        const user = req.user;
        if(!user) {
            return res.status(401).json({ message: 'User is not authorized'});
        }
        const cart = await Cart.findOne({ user : user.id});

        if(!cart) {
            return res.status(404).json({message: 'Cart not found'});
        }
        const cartItems = cart.items;
        const cartId = cart._id;
        res.status(200).json({message: ' Cart items retrieved successfully', cartId, cartItems});
    } catch(err) {
        console.log(err);
    }
}

//finalize Order With Bill
// const finalizeOrderWithBill = async(req, res, next) => {
//     try {
//         const user = req.user;
//         if(!user) {
//             return res.status(401).json({message: "User is not authorized"});
//         }
//         // const { order, billNumber} = req.body;
//         const cart = await Cart.findOne({ user: user.id});

//         if(!cart || !cart.items.length) {
//             return res.status(400).json({message: "Cart is Empty"});
//         }
//         let totalBillAmount =0;
//         for(const item of cart.items) {
//             const product = await Product.findById(item.product);
//             if(!product) {
//                 return res.status(404).json({ message: "Product not found"});
//             }
//             totalBillAmount += product.price * item.quantity;
//         }
//         const billNumber = generateBillNumber();
//         console.log(billNumber);
//         const bill = new Bill({
//             order: cart.order,
//             billNumber: billNumber,
//             totalBillAmount,
//         });
//         await bill.save();

//         cart.items = [];
//         await cart.save();

//         // const updatedOrder = await Order.findByIdAndUpdate(order, { status: 'Completed'}, { new: true});
//         res.status(200).json({message: "Bill finalized successfully", bill});
//     } catch (err) {
//         console.log(err);
//     }
// };

const finalizeOrderWithBill = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const cartId = req.params.cartId;
        console.log('Received cart id: ', cartId);
        const orderId = req.params.orderId;
        console.log('Received order id:' , orderId);
        const cart = await Cart.findById(cartId);
        console.log('Cart', cart);
        // if(!user) {
        //     return res.status(401).json({message: "User is not authorized"});
        // }
        // // const { order, billNumber} = req.body;
        // const cart = await Cart.findOne({ user: user.id});

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        // if(!cart || !cart.items.length) {
        //     return res.status(400).json({message: "Cart is Empty"});
        // }
        if(!cart.items || cart.items.length === 0) {
            return res.status(400).json({message: "Cart is Empty"});
        }

        let totalBillAmount =0;
        for(const item of cart.items) {
           
            totalBillAmount += item.price * item.quantity;
            }
            const billNumber = generateBillNumber();
            console.log("Generated Bill Number: ",billNumber);
            const bill = new Bill({
                order: orderId,
                billNumber: billNumber,
                totalBillAmount: totalBillAmount,

        
        });
        await bill.save();
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: 'Completed'}, { new: true});

        cart.items = [];
        await cart.save();

        res.status(200).json({message: "Bill finalized successfully", bill: bill, updatedOrder: updatedOrder});
    } catch (err) {
        console.log(err);
    }
};

// to get All Bills For TruckDriver
const getAllBillsForTruckDriver = async(req, res, next) => {
    try {
        const truckDriverId = req.user.id;
        console.log("truck driver Id: ",truckDriverId);
        const bills = await Bill.find({ truckDriver: truckDriverId});

        if(bills.length === 0) {
            return res.status(404).json({ message: 'No bills found for this Truck Driver'});
        }
        res.status(200).json(bills);
    } catch(err) {
        console.log(err);
    }
}

module.exports = { createOrder, getAllOrders, addToCart, finalizeOrderWithBill, getAllOrdersForTruckDriver, getAllBillsForTruckDriver, getCartItemsForTruckDriver };

