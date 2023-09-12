const Category = require('../models/cateogoryModel');
const { validationResult } = require('express-validator');

const createCategory = async(req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const { name } = req.body;
        const category = new Category({ name });

        await category.save();

        res.status(200).json({message: 'Category created successfully', category});
    } catch(err) {
        console.log(err);
    }
};

const getAllCategories = async(req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch(err) {
        console.log(err);
    }
};

const getSingleCategoryById = async(req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if(!category) {
            return res.status(404).json({message: "category not found"})
        }
        res.status(200).json(category);
    } catch (err) {
        console.log(err);
    }
};

const updateCategory = async(req, res) => {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name },
            { new: true }
        );

        if(!updatedCategory) {
            res.status(404).json({ message: 'Category not found'});
        }

        res.status(200).json({ message:"Category updated successfully", updatedCategory});
    } catch (err) {
        console.log(err);
    }
};

const deleteCategory = async(req, res) => {
    try {
        const  categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if(!deletedCategory) {
            return res.status(404).json({ message: 'Category not found'});
        }
        res.status(200).json({ message: 'Category deleted Successfully'});
    } catch (err) {
        console.log(err);
    }
}; 

module.exports = { createCategory, getAllCategories, getSingleCategoryById, updateCategory, deleteCategory };