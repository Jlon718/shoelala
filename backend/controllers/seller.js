const Seller = require('../models/seller') 

exports.getSellers = async (req, res, next) => {
    const sellers = await Seller.find();
    if (!sellers)
        return res.status(400).json({message: 'error loading sellers'})
    return res.status(200).json({
        success: true, 
        count: sellers.length,
        sellers
    })
}