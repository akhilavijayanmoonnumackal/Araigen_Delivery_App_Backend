const express = require('express');
const { adminLogin, registerAdmin } = require('../controllers/adminControllers');
const { addProducts, getAllProducts, singleProduct, updateProduct, deleteProduct } = require('../controllers/productControllers');
const router = express.Router();


router.post('/', registerAdmin);
router.post('/adminLogin', adminLogin);
router.post('/addProduct', addProducts);
router.get('/allProducts', getAllProducts);
router.get('/singleProduct/:id', singleProduct);
router.put('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;