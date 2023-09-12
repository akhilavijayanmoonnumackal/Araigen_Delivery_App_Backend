const express = require('express');
const router = express.Router();

const { validateToken } = require('../middlewares/validateTokenHandler');
const {  doSignup, doLogin } = require('../controllers/userControllers');
const { orderValidationRules, validate } = require('../middlewares/validationMiddleware');
const { getAllVendors } = require('../controllers/vendorControllers');
const { fetchProducts } = require('../controllers/productControllers');
const { getAllOrdersForTruckDriver, addToCart, finalizeOrderWithBill, getAllPreparedBills, getCartItems } = require('../controllers/orderControllers');

//Truck Driver Signup and Login
router.post('/signup', doSignup);
router.post('/login', doLogin); 

//to get all the vendors list
router.get('/vendors', validateToken,  getAllVendors);

//all the product list
router.get('/fetchProducts', validateToken, fetchProducts);

//to get all orders
router.get('/getAllOrdersForTruckDriver', validateToken, getAllOrdersForTruckDriver);

//add to cart based on the order
router.post('/addToCart/:orderId', validateToken, addToCart);

router.get('/getCartItems', validateToken, getCartItems);

// Finalize an order with a bill
router.post('/finalizeOrderWithBill/:cartId/:orderId', validateToken, finalizeOrderWithBill);

// Get all bills
router.get('/getAllPreparedBills', validateToken, getAllPreparedBills);

    

module.exports = router;