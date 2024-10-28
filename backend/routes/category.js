const express = require('express');
const router = express.Router();

const { getCategory, } = require('../controllers/category');
router.get('/categories', getCategory)

module.exports = router;