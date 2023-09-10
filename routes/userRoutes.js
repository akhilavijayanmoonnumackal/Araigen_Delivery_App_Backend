const express = require('express');
const router = express.Router();

const { validateToken } = require('../middlewares/validateTokenHandler');
const {  doSignup, doLogin } = require('../controllers/userControllers');
const { orderValidationRules, validate } = require('../middlewares/validationMiddleware');
const { getAllVendors } = require('../controllers/vendorControllers');
const { getAllProducts } = require('../controllers/productControllers');
const { createOrder, addToCart, finalizeOrderWithBill, getAllBills, getAllOrdersForUser } = require('../controllers/orderControllers');

//Truck Driver Signup and Login
router.post('/signup', doSignup);
router.post('/login', doLogin); 

//to get all the vendors list
router.get('/vendors', validateToken,  getAllVendors);

//to get orders
// router.post('/orders', validateToken, orderValidationRules, validate, createOrder);

router.post('/createOrder', validateToken, orderValidationRules,validate, createOrder);
router.get('/getAllOrdersForUser/:userId', validateToken, getAllOrdersForUser);
router.post('/addToCart', validateToken, addToCart);

//all the product list
router.get('/getAllProducts', validateToken, getAllProducts);

// Finalize an order with a bill
router.post('/finalizeOrderWithBill/:orderId', validateToken, finalizeOrderWithBill);

// Get all bills
router.get('/getAllBills', validateToken, getAllBills);



//add to cart
// router.post('/addToCart', validateToken, addToCart);

// //finalize order
// router.post('/finalizeOrderWithBill', validateToken, finalizeOrderWithBill);

// //get all bills
// router.get('/getAllBills', getAllBills);

    

module.exports = router;