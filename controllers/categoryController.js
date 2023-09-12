const Category = require('../models/cateogoryModel');
const { validationResult } = require('express-validator');

//create category
const createCategory = async(req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const { name } = req.body;
        const category = new Category({ name });
        try {
            await category.save();
            res.status(200).json({ success: true, message: 'Category created successfully', category});
        } catch (err) {
            console.error(err);
            return res.status(400).json({ success: false, message: 'Category name already exists' });
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//get all categories
const getAllCategories = async(req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, categories});
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//get single category by ID
const getSingleCategoryById = async(req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if(!category) {
            return res.status(404).json({message: "category not found"})
        }
        res.status(200).json({ success: true, category});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//update category
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
        const existingCategory = await Category.findOne({ name });
        if (existingCategory && existingCategory._id.toString() !== categoryId) {
            return res.status(400).json({ success: false, message: 'Category name already exists' });
        }

        res.status(200).json({ success: true, message:"Category updated successfully", updatedCategory});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//delete category
const deleteCategory = async(req, res) => {
    try {
        const  categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if(!deletedCategory) {
            return res.status(404).json({ message: 'Category not found'});
        }
        res.status(200).json({ success: true, message: 'Category deleted Successfully'});
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}; 

module.exports = { createCategory, getAllCategories, getSingleCategoryById, updateCategory, deleteCategory };