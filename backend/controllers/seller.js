const Seller = require('../models/seller') 

exports.getSeller = async (req, res, next) => {
    const sellers = await Seller.find();
    if (!sellers)
        return res.status(400).json({message: 'error loading sellers'})
    return res.status(200).json({
        success: true, 
        count: sellers.length,
        sellers
    })
};
exports.getSellers = async (req, res, next) => {
    try {
        const sellers = await Seller.find();
        res.status(200).json({
            success: true,
            sellers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};