const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Bill = require('../models/billModel');
const { validationResult } = require('express-validator'); 

//order management(C)
const createOrder = async(req, res, next) => {
    try {
        const { products, truckDriver, vendorDetails, totalBillAmount, collectedAmount } = req.body;
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
        const orders = await Order.find({truckDriver: userId })
        .populate({
            path: 'products.product',
            model: 'Product',
        })
        .populate('vendorDetails');
        console.log("Orders: ", orders);
        res.status(200).json(orders);
    } catch(err) {
        console.log(err);
    }
};

//add to cart based on order
const addToCart = async (req, res, next) => {
    try {
        const { orderId, productId, quantity } = req.body;
        const user = req.user;

        let cart = await Cart.findOne({ user: user.id, order: orderId });
        if (!cart) {
            cart = new Cart({ user: user.id, order: orderId, items: [] });
        }

        cart.items.push({ product: productId, quantity });
        await cart.save();

        res.status(200).json({ message: 'Product added to the cart', cart });
    } catch (err) {
        console.log(err);
    }
};

//finalize Order With Bill
const finalizeOrderWithBill = async(req, res, next) => {
    try {
        const user = req.user;
        if(!user) {
            return res.status(401).json({message: "User is not authorized"});
        }
        const { order, billNumber} = req.body;
        const cart = await Cart.findOne({ user: user.id});

        if(!cart || !cart.items.length) {
            return res.status(400).json({message: "Cart is Empty"});
        }
        let totalBillAmount =0;
        for(const item of cart.items) {
            const product = await Product.findById(item.product);
            if(!product) {
                return res.status(404).json({ message: "Product not found"});
            }
            totalBillAmount += product.price * item.quantity;
        }

        const bill = new Bill({
            order: order,
            billNumber: billNumber,
            totalBillAmount,
        });
        await bill.save();

        cart.items = [];
        await cart.save();
        res.status(200).json({message: "Bill finalized successfully", bill});
    } catch (err) {
        console.log(err);
    }
};

// to get All Bills For TruckDriver
const getAllBillsForTruckDriver = async(req, res, next) => {
    try {
        const truckDriverId = req.params.id;
        const bills = await Bill.find({ truckDriver: truckDriverId});
        res.status(200).json(bills);
    } catch(err) {
        console.log(err);
    }
}

module.exports = { createOrder, getAllOrders, addToCart, finalizeOrderWithBill, getAllOrdersForTruckDriver, getAllBillsForTruckDriver };

