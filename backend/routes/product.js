const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const { isAuthenticatedUser, } = require('../middlewares/auth');
const { getProducts, getSingleProduct, newProduct, updateProduct, deleteProduct, bulkDeleteProducts, productSales, createProductReview, getProductReviews, } = require('../controllers/product');

router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);
router.post('/products/bulk-delete', bulkDeleteProducts);
router.get('/admin/product-sales', productSales);
router.post('/admin/product/new', isAuthenticatedUser, upload.array('images', 10), newProduct);
router.route('/admin/product/:id').delete(deleteProduct).put(updateProduct);
router.put('/review', isAuthenticatedUser, createProductReview);
router.get('/reviews', getProductReviews)

module.exports = router;