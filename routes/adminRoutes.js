const express = require('express');
const { validateTokenAdmin } = require('../middlewares/validateTokenHandler');
const { adminLogin, registerAdmin, createTruckDriver, getAllTruckDrivers, getSingleTruckDriver, updateTruckDriver, deleteTruckDriver } = require('../controllers/adminControllers');
const { createCategory, getAllCategories, getSingleCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { addProducts, fetchProducts, singleProduct, updateProduct, deleteProduct } = require('../controllers/productControllers');
const { createVendor, getAllVendors, getVendorById, updateVendorById, deleteVendorById } = require('../controllers/vendorControllers');
const { createOrder, getAllOrders } = require('../controllers/orderControllers'); 
const { orderValidationRules , validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

//admin login & register
router.post('/', registerAdmin);
router.post('/adminLogin', adminLogin);

//category management(CRUD)
router.post('/createCategory', validateTokenAdmin, createCategory);
router.get('/getAllCategories', validateTokenAdmin, getAllCategories);
router.get('/getSingleCategoryById/:id', validateTokenAdmin, getSingleCategoryById);
router.put('/updateCategory/:id', validateTokenAdmin, updateCategory);
router.delete('/deleteCategory/:id', validateTokenAdmin, deleteCategory);

//product management(CRUD)
router.post('/addProduct', validateTokenAdmin, addProducts);
router.get('/fetchProducts', validateTokenAdmin, fetchProducts);
router.get('/singleProduct/:id', validateTokenAdmin, singleProduct);
router.put('/updateProduct/:id', validateTokenAdmin, updateProduct);
router.delete('/deleteProduct/:id', validateTokenAdmin, deleteProduct);

//truck driver management(CRUD)
router.post('/createTruckDriver', validateTokenAdmin,  createTruckDriver);
router.get('/getAllTruckDrivers', validateTokenAdmin, getAllTruckDrivers);
router.get('/getSingleTruckDriver/:id', validateTokenAdmin, getSingleTruckDriver);
router.put('/updateTruckDriver/:id', validateTokenAdmin, updateTruckDriver);
router.delete('/deleteTruckDriver/:id', validateTokenAdmin, deleteTruckDriver);

//vendor management(CRUD)
router.post('/createVendor', validateTokenAdmin, createVendor);
router.get('/getAllVendors', validateTokenAdmin, getAllVendors);
router.get('/getVendorById/:id', validateTokenAdmin, getVendorById);
router.put('/updateVendorById/:id', validateTokenAdmin, updateVendorById);
router.delete('/deleteVendorById/:id', validateTokenAdmin, deleteVendorById);

//order management(CR)
router.post('/createOrder', validateTokenAdmin, orderValidationRules, validate, createOrder);
router.get('/getAllOrders', validateTokenAdmin, getAllOrders);

module.exports = router;