const Category = require('../models/category');

exports.getCategory = async(req, res, next) => {
    const category = await Category.find();
    if (!category)
        return res.status(400).json({message: 'error loading categories'})
    return res.status(200).json({
        success: true,
        count: category.length,
        category
    })
};

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};