const express = require('express');
const router = express.Router();

const { getBrand, getBrands } = require('../controllers/brand');
router.get('/brands', getBrand)
router.get('/allBrands', getBrands);
module.exports = router;