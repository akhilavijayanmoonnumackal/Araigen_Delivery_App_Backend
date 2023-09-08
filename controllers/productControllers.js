const Product = require('../models/productModel');

const addProducts = async (req, res, next) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product)
    } catch (err) {
        console.log(err);
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
    }
};

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
        res.status(200).json(updatedProduct);
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
        res.status(200).json(product);
    } catch (err) {
        console.log(err);
    }
}

module.exports ={ addProducts, getAllProducts, singleProduct, updateProduct, deleteProduct };