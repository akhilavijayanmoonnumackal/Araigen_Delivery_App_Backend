const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Bill = require('../models/billModel');
const { validationResult } = require('express-validator'); 
const { generateBillNumber } = require('../utils/billUtils');
const Category = require('../models/cateogoryModel');

//order management(C)
const createOrder = async(req, res, next) => {
    try {
        const { products, truckDriver, vendorDetails, totalBillAmount, collectedAmount, status } = req.body;
        if(!Array.isArray(products) || products.some(item => !item.product || isNaN(item.quantity))) {
            return res.status(400).json({ message: 'Invalid Product Details'});
        }
        const order = new Order({ products, truckDriver, vendorDetails, totalBillAmount, collectedAmount });
        const savedOrder = await order.save();
        res.status(200).json({ success: true, message: "Order Created", savedOrder});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//order management(R)
const getAllOrders = async(req, res, next) => {
    try {
        const orders = await Order.find().populate({
            path: 'products.product',
            model: 'Product',
            populate: {
                path: 'categoryname',
                model: 'Category'
            }
        })
        .populate('truckDriver')
        .populate('vendorDetails');
        res.status(200).json({ success: true, orders});
        
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false ,message: 'Internal server error' });
    }
};

//truck driver's all orders
const getAllOrdersForTruckDriver = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const userName = req.user.username;
        console.log("Userid: ",userId);
        const orders = await Order.find({truckDriver: userId })
        .populate({
            path: 'products.product',
            model: 'Product',
            populate: {
                path: 'categoryname',
                model: 'Category'
            }
        })
        .populate('vendorDetails');

        if(orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this Truck Driver.'});
        }
        console.log("Orders: ", orders);
        res.status(200).json({ success: true, message: `${userName}'s Orders: `,orders});
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//add to cart
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
            res.status(200).json({ success: true, message: 'Product added to the cart', cart });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//to get cart items
const getCartItems = async (req, res, next) => {
    try {
        
        const userId = req.user.id;
        const cartItems = await Cart.find({ user: userId })
        .populate({
            path: 'items.product',
            model: Product,
            populate: {
                path: 'categoryname',
                model: Category,
            }
        });

        res.status(200).json({ success: true, cartItems});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//bill preparation
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

        res.status(200).json({ success: true, message: "Bill finalized successfully", bill: bill, updatedOrder: updatedOrder});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//to get all bills
const getAllPreparedBills = async (req, res, next) => {
    try {
        const bills = await Bill.find();
        res.status(200).json({ success: true, bills});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { createOrder, getAllOrders, addToCart, finalizeOrderWithBill, getAllOrdersForTruckDriver, getCartItems, getAllPreparedBills   };

