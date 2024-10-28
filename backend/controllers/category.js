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
}