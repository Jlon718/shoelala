const express = require('express');
const router = express.Router();

const { getCategory,getCategories } = require('../controllers/category');
router.get('/categories', getCategory)
router.get('/allCategories', getCategories)

module.exports = router;