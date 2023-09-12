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
};

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
};

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
// const addToCart = async (req, res, next) => {
//     try {
//         const { orderId } = req.params;
//         const { items} = req.body;
//         const user = req.user;
        
//         let order = await Order.findById(orderId);

//         if(!order || order.truckDriver.toString() !== user.id.toString()) {
//             return res.status(401).json({ message: 'Unauthorized. This is not your order!!!'});
//         }

//         let cart = await Cart.findOne({ user: user.id, order: orderId });
//         if (!cart) {
//             cart = new Cart({ user: user.id, order: orderId, items: [] });
//         }
//         for(const item of items) {
//             const { productId, quantity } = item;

//             const product = await Product.findById(productId);
//             if(!product) {
//                 return res.status(404).json({message: 'Product not found'});
//             }
//             cart.items.push({ 
//                 product: productId, 
//                 quantity,
//                 price: product.price,
//             });
//         }
//             await cart.save();
//             console.log('Cart Items:', cart.items);
//             res.status(200).json({ message: 'Product added to the cart', cart });
//     } catch (err) {
//         console.log(err);
//     }
// };

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

            const existingItem = cart.items.find(cartItem => cartItem.product.toString() === productId);
            if(existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ 
                    product: productId, 
                    quantity,
                    price: product.price,
                });
            }
        }
            await cart.save();
            console.log('Cart Items:', cart.items);
            res.status(200).json({ message: 'Product added to the cart', cart });
    } catch (err) {
        console.log(err);
    }
};

const getCartItems = async (req, res, next) => {
    try {
        // Retrieve the authenticated user's ID from req.user if needed
        const userId = req.user.id; // Replace with your authentication logic

        // Query the Cart model to retrieve cart items for the user
        const cartItems = await Cart.find({ user: userId }).populate('items.product');

        // Send the cart items as a response
        res.status(200).json(cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// const getCartItemsForTruckDriver = async(req, res, next) => {
//     try {
//         const user = req.user;
//         if(!user) {
//             return res.status(401).json({ message: 'User is not authorized'});
//         }
//         const cart = await Cart.findOne({ user : user.id});

//         if(!cart) {
//             return res.status(404).json({message: 'Cart not found'});
//         }
//         const cartItems = cart.items;
//         const cartId = cart._id;

//         console.log('User ID: ', user.id);
//         console.log("CartIDDDD: ", cartId);
//         console.log('Cart Items:', cartItems);

//         res.status(200).json({message: ' Cart items retrieved successfully', cartId, cartItems});
//     } catch(err) {
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

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

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
                truckDriver: userId,
        
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


const getAllPreparedBills = async (req, res, next) => {
    try {
        // Query the Bill model to retrieve all bills
        const bills = await Bill.find();

        // Send the bills as a response
        res.status(200).json(bills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// to get All Bills For TruckDriver
// const getAllBillsForTruckDriver = async(req, res, next) => {
//     try {
//         const truckDriverId = req.user.id;
//         console.log("truck driver Id: ",truckDriverId);
//         const bills = await Bill.find({ truckDriver: truckDriverId});

//         if(bills.length === 0) {
//             return res.status(404).json({ message: 'No bills found for this Truck Driver'});
//         }
//         res.status(200).json(bills);
//     } catch(err) {
//         console.log(err);
//     }
// };

// const getAllBillsForTruckDriver = async(req, res, next) => {
//     try {
//         const truckDriverId = req.user.id;
//         console.log("truck driver Iddd: ",truckDriverId);
//         if(!truckDriverId) {
//             return res.status(400).json({message: 'Invalid truck driver ID'});
//         }
//         const bills = await Bill.find({ truckDriver: truckDriverId});

//         console.log('Bills', bills);
//         if(!bills || bills.length === 0) {
//             return res.status(404).json({ message: 'No bills found for this Truck Driver'});
//         }
//         res.status(200).json(bills);
//     } catch(err) {
//         console.log(err);
//     }
// };
// const orderUpdation = async(req, res, next) => {
//     const orderId = req.params.orderId;
//     try {
//         const order = await Order.findByIdAndUpdate(
//             orderId,
//             { status: 'Completed'},
//             { new: true }
//         );
//          if(!order) {
//             return res.status(404).json({ message: 'Order not Found'});
//          }
//          res.status(200).json({ message: 'Order marked as Completed', order});
//     } catch (err) {
//         console.log(err);
//     }
// }

module.exports = { createOrder, getAllOrders, addToCart, finalizeOrderWithBill, getAllOrdersForTruckDriver, getCartItems, getAllPreparedBills   };

