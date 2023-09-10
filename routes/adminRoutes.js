const express = require('express');
const { validateToken } = require('../middlewares/validateTokenHandler');
const { adminLogin, registerAdmin, createTruckDriver, getAllTruckDrivers, getSingleTruckDriver, updateTruckDriver, deleteTruckDriver } = require('../controllers/adminControllers');
const { addProducts, getAllProducts, fetchProducts, singleProduct, updateProduct, deleteProduct } = require('../controllers/productControllers');
const { createVendor, getAllVendors, getVendorById, updateVendorById, deleteVendorById } = require('../controllers/vendorControllers');
const { createOrder, getAllOrders } = require('../controllers/orderControllers'); 
const { orderValidationRules , validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

//admin login & register
router.post('/', registerAdmin);
router.post('/adminLogin', adminLogin);

//product management(CRUD)
router.post('/addProduct', validateToken, addProducts);
router.get('/allProducts', validateToken, getAllProducts);
router.get('/fetchProducts', validateToken, fetchProducts);
router.get('/singleProduct/:id', validateToken, singleProduct);
router.put('/updateProduct/:id', validateToken, updateProduct);
router.delete('/deleteProduct/:id', validateToken, deleteProduct);

//truck driver management(CRUD)
router.post('/createTruckDriver', validateToken,  createTruckDriver);
router.get('/getAllTruckDrivers', validateToken, getAllTruckDrivers);
router.get('/getSingleTruckDriver/:id', validateToken, getSingleTruckDriver);
router.put('/updateTruckDriver/:id', validateToken, updateTruckDriver);
router.delete('/deleteTruckDriver/:id', validateToken, deleteTruckDriver);

//vendor management(CRUD)
router.post('/createVendor', validateToken, createVendor);
router.get('/getAllVendors', validateToken, getAllVendors);
router.get('/getVendorById/:id', validateToken, getVendorById);
router.put('/updateVendorById/:id', validateToken, updateVendorById);
router.delete('/deleteVendorById/:id', validateToken, deleteVendorById);

//order management(CR)
router.post('/createOrder', validateToken, orderValidationRules, validate, createOrder);
router.get('/getAllOrders', validateToken, getAllOrders);

module.exports = router;