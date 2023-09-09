const express = require('express');
const { adminLogin, registerAdmin, getUsers, createTruckDriver, getAllTruckDrivers, getSingleTruckDriver, updateTruckDriver, deleteTruckDriver } = require('../controllers/adminControllers');
const { addProducts, getAllProducts, fetchProducts, singleProduct, updateProduct, deleteProduct } = require('../controllers/productControllers');
const { createVendor, getAllVendors, getVendorById, updateVendorById, deleteVendorById } = require('../controllers/vendorControllers');
const { createOrder, getAllOrders } = require('../controllers/orderControllers'); 
const { orderValidationRules , validate } = require('../middlewares/validationMiddleware');

const router = express.Router();


router.post('/', registerAdmin);
router.post('/adminLogin', adminLogin);


router.post('/addProduct', addProducts);
router.get('/allProducts', getAllProducts);
router.get('/fetchProducts', fetchProducts);
router.get('/singleProduct/:id', singleProduct);
router.put('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);

router.post('/createTruckDriver',  createTruckDriver);
router.get('/getAllTruckDrivers', getAllTruckDrivers);
router.get('/getSingleTruckDriver/:id', getSingleTruckDriver);
router.put('/updateTruckDriver/:id', updateTruckDriver);
router.delete('/deleteTruckDriver/:id',deleteTruckDriver);

router.post('/createVendor', createVendor);
router.get('/getAllVendors', getAllVendors);
router.get('/getVendorById/:id', getVendorById);
router.put('/updateVendorById/:id', updateVendorById);
router.delete('/deleteVendorById/:id', deleteVendorById);

router.post('/createOrder', orderValidationRules, validate, createOrder);
router.get('/getAllOrders', getAllOrders);

module.exports = router;