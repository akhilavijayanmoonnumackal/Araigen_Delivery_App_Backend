const express = require('express');
const router = express.Router();

const { validateToken } = require('../middlewares/validateTokenHandler');
const {  doSignup, doLogin } = require('../controllers/userControllers');
const { orderValidationRules, validate } = require('../middlewares/validationMiddleware');
const { getAllVendors } = require('../controllers/vendorControllers');
const { getAllProducts } = require('../controllers/productControllers');
const { getAllOrdersForTruckDriver, addToCart, finalizeOrderWithBill, getAllBillsForTruckDriver } = require('../controllers/orderControllers');

//Truck Driver Signup and Login
router.post('/signup', doSignup);
router.post('/login', doLogin); 

//to get all the vendors list
router.get('/vendors', validateToken,  getAllVendors);

//all the product list
router.get('/getAllProducts', validateToken, getAllProducts);

//to get all orders
router.get('/getAllOrdersForTruckDriver', validateToken, getAllOrdersForTruckDriver);

//add to cart based on the order
router.post('/addToCart/:orderId', validateToken, addToCart);

// Finalize an order with a bill
router.post('/finalizeOrderWithBill', validateToken, finalizeOrderWithBill);

// Get all bills
router.get('/getAllBillsForTruckDriver', validateToken, getAllBillsForTruckDriver);





    

module.exports = router;