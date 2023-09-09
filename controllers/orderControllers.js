const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const createOrder = async( req, res, next) => {
    try {   
        const { products, truckDriver, vendorDetails, totalBillAmount, collectedAmount} = req.body;
        const order = new Order({ products, truckDriver, vendorDetails, totalBillAmount, collectedAmount});
        const savedOrder = await order.save();
        res.status(200).json(savedOrder);
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

const addToCart = async(req, res, next) => {
    try {
        const {productId, quantity } = req.body;
        if( !productId || !quantity || isNaN(quantity) || quantity<=0 ) {
            return res.status(400).json({ message: 'Invalid input data'});
        }
        const product = await Product.findById(productId);
        if(!product) {
            return res.status(404).json({ message: 'Product Not Found'});
        }
        const {id} = req.params;
        let cart = await Cart.findOne(id);

        if(!cart) {
            cart = new Cart({ id, items: []});
        }

        const existingCartItem = cart.items.find(item => item.product.equals(productId));

        if(existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity});
        }
        
        await cart.save();

        return res.status(200).json({ message: 'Product added to the cart', cart})
    } catch (err) {
        console.log(err);
    }
    
};



module.exports = { createOrder, getAllOrders, addToCart };