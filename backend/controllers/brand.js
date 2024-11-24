const Brand = require('../models/brand');

exports.getBrand = async(req, res, next) => {
    const brand = await Brand.find();
    if (!brand)
        return res.status(400).json({message: 'error loading brands'})
    return res.status(200).json({
        success: true,
        count: brand.length,
        brand
    })
};

exports.getBrands = async (req, res, next) => {
    try {
        const brands = await Brand.find();
        res.status(200).json({
            success: true,
            brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};