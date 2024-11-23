const express = require('express')
const router = express.Router();
const { newOrder, getMonthlySales, allOrders, deleteOrder, updateOrder, getSingleOrder, myOrders, totalOrders, getGrossSales } = require('../controllers/order')
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/order/new', newOrder);
router.get('/total/gross-sales', getGrossSales);
router.get('/total/orders', totalOrders);
router.get('/admin/monthly-sales', getMonthlySales);
router.get('/admin/orders', allOrders);
router.get('/order/:id', getSingleOrder);
router.route('/admin/order/:id').delete( deleteOrder).put( updateOrder);
router.get('/orders/me', isAuthenticatedUser, myOrders);

module.exports = router;