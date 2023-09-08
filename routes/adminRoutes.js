const express = require('express');
const { adminLogin, registerAdmin, getUsers, addUser, getSingleUser, updateUser, deleteUser } = require('../controllers/adminControllers');
const { addProducts, getAllProducts, singleProduct, updateProduct, deleteProduct } = require('../controllers/productControllers');
const router = express.Router();


router.post('/', registerAdmin);
router.post('/adminLogin', adminLogin);
router.post('/addProduct', addProducts);
router.get('/allProducts', getAllProducts);
router.get('/singleProduct/:id', singleProduct);
router.put('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);
router.get('/getUsers', getUsers);
router.post('/addUser', addUser);
router.get('/getSingleUser/:id', getSingleUser);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;