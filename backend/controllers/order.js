const Order = require('../models/order');
const Product = require('../models/product');
exports.newOrder = async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })
    return res.status(200).json({
        success: true,
        order
    })
};

exports.getMonthlySales = async (req, res, next) => {
    try {
        const sales = await Order.aggregate([
            {
                $match: {
                    deliveredAt: { $ne: null } // Only include orders that have been delivered
                }
            },
            {
                $addFields: {
                    month: { $month: "$deliveredAt" },
                    year: { $year: "$deliveredAt" }
                }
            },
            {
                $group: {
                    _id: { month: "$month", year: "$year" },
                    totalSales: { $sum: "$totalPrice" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    year: "$_id.year",
                    totalSales: 1
                }
            }
        ]);

        console.log('Sales Data:', sales); // Debugging log

        res.status(200).json({
            success: true,
            sales
        });
    } catch (error) {
        console.error('Error fetching monthly sales data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching monthly sales data'
        });
    }
};