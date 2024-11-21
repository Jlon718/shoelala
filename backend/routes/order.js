const express = require('express')
const router = express.Router();
const { newOrder, salesPerMonth } = require('../controllers/order')

router.get('/admin/sales-per-month', salesPerMonth);
module.exports = router;


