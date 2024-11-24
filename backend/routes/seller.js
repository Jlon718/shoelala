const express = require('express');
const router = express.Router();

const { getSeller,getSellers } = require('../controllers/seller');
router.get('/sellers', getSeller)
router.get('/allSellers', getSellers)

module.exports = router;