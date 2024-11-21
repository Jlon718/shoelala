const express = require('express')
const router = express.Router();
const { newOrder, getMonthlySales } = require('../controllers/order')
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/order/new', isAuthenticatedUser, newOrder);
router.get('/admin/monthly-sales', getMonthlySales);
module.exports = router;