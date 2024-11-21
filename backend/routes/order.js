const express = require('express')
const router = express.Router();
const { newOrder, salesPerMonth } = require('../controllers/order')
const { isAuthenticatedUser } = require('../middlewares/auth');


router.post('/order/new', isAuthenticatedUser, newOrder);

router.get('/admin/sales-per-month', salesPerMonth);
module.exports = router;