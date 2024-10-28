const express = require('express');
const router = express.Router();

const { getBrand, } = require('../controllers/brand');
router.get('/brands', getBrand)

module.exports = router;