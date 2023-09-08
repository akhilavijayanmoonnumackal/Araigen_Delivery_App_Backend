const express = require('express');
const { getAllUser, doSignup, doLogin } = require('../controllers/userControllers');
const router = express.Router();

router.get('/', getAllUser);
router.post('/signup', doSignup);
router.post('/login', doLogin);  

module.exports = router;