const express = require('express')
const router = express.Router();
const { newOrder, getMonthlySales } = require('../controllers/order')

router.get('/admin/monthly-sales', getMonthlySales);
module.exports = router;


