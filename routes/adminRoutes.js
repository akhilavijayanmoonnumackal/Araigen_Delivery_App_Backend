const express = require('express');
const { adminLogin, registerAdmin } = require('../controllers/adminControllers');
const router = express.Router();


router.post('/', registerAdmin);
router.post('/adminLogin', adminLogin);

module.exports = router;