const express = require('express');
const { getAllUser, doSignup, doLogin } = require('../controllers/userControllers');
const { getAllVendors } = require('../controllers/vendorControllers');
const { createOrder, addToCart } = require('../controllers/orderControllers');
const { orderValidationRules, validate } = require('../middlewares/validationMiddleware');
const { validateToken } = require('../middlewares/validateTokenHandler');

const router = express.Router();

router.get('/', getAllUser);
router.post('/signup', doSignup);
router.post('/login', doLogin); 

// router.get('/vendors', validateToken, orderValidationRules, validate, getAllVendors);
router.get('/vendors', validateToken,  getAllVendors);

router.post('/orders', validateToken, createOrder);

router.post('/addToCart', validateToken, addToCart);

    

module.exports = router;