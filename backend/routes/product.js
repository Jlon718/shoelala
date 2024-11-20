const express = require('express');
const router = express.Router();

const { getProducts, getSingleProduct, newProduct, updateProduct, deleteProduct } = require('../controllers/product');
router.get('/products', getProducts)
router.get('/product/:id', getSingleProduct)
router.post('/product/new', newProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

module.exports = router;