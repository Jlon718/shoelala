const Product = require('../models/product')

exports.getProducts = async (req, res, next) => {
    const products = await Product.find();
    if (!products)
        return res.status(400).json({message: 'error loading products'})
    return res.status(200).json({
        success: true, 
        count: products.length,
        products
    })
}

exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }
    return res.status(200).json({
        success: true,
        product
    })
}