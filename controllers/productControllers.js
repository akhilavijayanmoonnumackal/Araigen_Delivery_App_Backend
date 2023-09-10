const Product = require('../models/productModel');

const addProducts = async (req, res, next) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json({message: "Product Added Successfully", product});
    } catch (err) {
        console.log(err);
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.status(200).json({message: "Product Lists", products});
    } catch (err) {
        console.log(err);
    }
};

const fetchProducts = async(req, res, next) => {
    try {
        const products = await Product.find().populate('category');
        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const singleProduct = async (req, res, next) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product)
    } catch(err) {
        console.log(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product) {
            return res.status(404).json({ message: `Cannot find any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json({message: "Product Updated Successfully", updatedProduct});
    } catch (err) {
        console.log(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product) {
            return res.status(404).json({message: `Cannot find any product with ID ${id}`})
        }
        const deletedProduct = await Product.findById(id);
        res.status(200).json({message: "Product Deleted Successfully"});
    } catch (err) {
        console.log(err);
    }
};

module.exports ={ addProducts, getAllProducts, singleProduct, updateProduct, deleteProduct, fetchProducts };