const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { getProducts, getSingleProduct, newProduct, updateProduct, deleteProduct, bulkDeleteProducts, productSales, createProductReview, getProductReviews,deleteReview, getAllProducts, getIndexProducts } = require('../controllers/product');
const { getCategory } = require('../controllers/category');

router.get('/products', getProducts);
router.get('/index/products', getIndexProducts);
router.get('/total/products', getAllProducts);
router.get('/product/:id', getSingleProduct);
router.put('/update/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);
router.post('/products/bulk-delete', bulkDeleteProducts);
router.get('/admin/product-sales', productSales);
router.post('/admin/product/new', isAuthenticatedUser, upload.array('images', 10), newProduct);
router.route('/admin/product/:id').delete(deleteProduct).put(updateProduct);
router.put('/review', isAuthenticatedUser, createProductReview);
router.get('/reviews',  getProductReviews);
router.delete('/reviews', deleteReview)

module.exports = router;