const express = require('express');
const router = express.Router();

const { getSellers, } = require('../controllers/seller');
router.get('/sellers', getSellers)

module.exports = router;