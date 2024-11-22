const express = require('express')
const router = express.Router();
const { newOrder, getMonthlySales, allOrders, deleteOrder, updateOrder, getSingleOrder, myOrders } = require('../controllers/order')
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/order/new', isAuthenticatedUser, newOrder);
router.get('/admin/monthly-sales', getMonthlySales);
router.get('/admin/orders/', isAuthenticatedUser, allOrders);
router.get('/order/:id', isAuthenticatedUser, getSingleOrder);
router.route('/admin/order/:id').delete(isAuthenticatedUser, deleteOrder).put(isAuthenticatedUser, updateOrder);
router.get('/orders/me', isAuthenticatedUser, myOrders);

module.exports = router;