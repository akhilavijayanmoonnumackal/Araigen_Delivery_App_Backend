const { body, validationResult } = require('express-validator');
const Product = require('../models/productModel');
const Category = require('../models/cateogoryModel');

//to add products
const addProducts = async (req, res, next) => {
    try {
        await body('producttitle')
        .notEmpty()
        .withMessage('Product title is required')
        .run(req);

        await body('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a positive integer')
        .run(req);

        await body('categoryname')
        .notEmpty()
        .withMessage('Category name is required')
        run(req);

        await body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
        run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { producttitle, stock, categoryname, price, image } = req.body;
        const category = await Category.findById(categoryname);
        if(!category) {
            return res.status(400).json({message: 'Category not found'});
        }

        const product = new Product({
            producttitle,
            stock,
            categoryname: category._id,
            price,
            image,
        });

        await product.save();
        res.status(200).json({ success: true, message: 'Product added successfully', product});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//to fetch all products
const fetchProducts = async(req, res, next) => {
    try {
        const products = await Product.find().populate('categoryname');
        res.status(200).json({ success: true, products});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

//to get single product
const singleProduct = async (req, res, next) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id).populate('categoryname');
        res.status(200).json({ success: true, product})
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error'})
    }
};

//to update product
const updateProduct = async (req, res, next) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product) {
            return res.status(404).json({ message: `Cannot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id).populate('categoryname');
        res.status(200).json({ success: true, message: "Product Updated Successfully", updatedProduct});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//to delete product
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product) {
            return res.status(404).json({message: `Cannot find any product with ID ${id}`})
        }
        const deletedProduct = await Product.findById(id);
        res.status(200).json({ success: true, message: "Product Deleted Successfully", deletedProduct});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports ={ addProducts, singleProduct, updateProduct, deleteProduct, fetchProducts };