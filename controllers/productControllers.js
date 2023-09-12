const Product = require('../models/productModel');
const Category = require('../models/cateogoryModel');

const addProducts = async (req, res, next) => {
    try {
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
        res.status(200).json({ message: 'Product added successfully', product});
    } catch (err) {
        console.log(err);
    }
};

const fetchProducts = async(req, res, next) => {
    try {
        const products = await Product.find().populate('categoryname');
        res.status(200).json(products);
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

module.exports ={ addProducts, singleProduct, updateProduct, deleteProduct, fetchProducts };