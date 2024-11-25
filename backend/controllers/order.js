const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const sendNotification = require('./notification.service.js');

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
    console.log('Request Body:', req.body); // Debugging log
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            product.stock -= item.quantity;
            await product.save();
        }
    }

    const productList = orderItems.map(item => `${item.name} - ${item.quantity} x ₱${item.price}`).join('\n');
        const message = `
            Hi ${req.user.name},

            Your order has been placed successfully. Here are the details:

            Products/Services:
            ${productList}

            Subtotal: ₱${itemsPrice}
            Shipping: ₱${shippingPrice}
            Tax: ₱${taxPrice}
            Grand Total: ₱${totalPrice}

            Thank you for shopping with us!

            Best regards,
            Shoelala Team
        `;

        // Send email
        await sendEmail({
            email: req.user.email,
            subject: 'Order Confirmation',
            message
        });

        // const user = await User.findById(req.user.id);
        // if (user.fcmToken) {
        //     await sendPushNotification(user.fcmToken, message);
        // }

        // return res.status(200).json({
        //     success: true,
        //     order
        // });

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

exports.allOrders = async (req, res, next) => {
    const orders = await Order.find()
    // console.log(orders)
    if (!orders) {
        return res.status(404).json({
            message: 'No Orders',
        })
    }
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    return res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
};

exports.totalOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.status(200).json({
            success: true,
            orders,
            totalOrders: orders.length
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
};

exports.getGrossSales = async (req, res, next) => {
    try {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalSales: orders.length > 0 ? orders[0].totalSales : 0
        });
    } catch (error) {
        console.error('Error calculating gross sales:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating gross sales'
        });
    }
};

exports.deleteOrder = async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) {
        return res.status(400).json({
            message: 'No Order found with this ID',
        })
        // return next(new ErrorHandler('No Order found with this ID', 404))
    }
    return res.status(200).json({
        success: true
    })
};

exports.updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    console.log(req.body.order)
    if (!order) {
        return res.status(404).json({
            message: 'No Order found',
        })
    }
    if (order.orderStatus === 'Delivered') {
        return res.status(400).json({
            message: 'You have already delivered this order',
        })
    }
    const user = await User.findById(order.user)
    if (user.fcmToken) {
        await sendNotification({ deviceToken: user.fcmToken, title: 'Order Delivered', body: 'Your order has been delivered' });
      }
    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })
    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()
    await order.save()

    return res.status(200).json({
        success: true,
    })
}

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({
            message: 'No product found',
        })
    }
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false })
};

exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) {
        return res.status(404).json({
            message: 'No Order found with this ID',
        })
    }
    return res.status(200).json({
        success: true,
        order
    })
};

exports.myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })
    // console.log(req.user)
    if (!orders) 
        return res.status(400).json({message: 'error loading orders'})
    return res.status(200).json({
        success: true,
        orders
    })
}