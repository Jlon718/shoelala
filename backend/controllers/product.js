const Product = require('../models/product');
const Order = require('../models/order');
const cloudinary = require('cloudinary')

// Get all products


exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('seller', 'name');
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products,
            totalProducts: products.length
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products'
        });
    }
};

// Get single product
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Create new product
exports.newProduct = async (req, res, next) => {
	try {
        let images = [];
        if (typeof req.body.images === 'string') {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            try {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: 'products',
                    width: 150,
                    crop: "scale",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            } catch (error) {
                console.log(error);
            }
        }

        req.body.images = imagesLinks;
        req.body.user = req.user.id;

        const product = await Product.create(req.body);

        if (!product) {
            return res.status(400).json({
                success: false,
                message: 'Product not created'
            });
        }

        return res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating product'
        });
    }
};

// Update product
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let images = [];
        if (typeof req.body.images === 'string') {
            images.push(req.body.images);
        } else if (req.body.images) {
            images = req.body.images;
        }

        if (images.length > 0) {
            // Delete existing images from Cloudinary
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.uploader.destroy(product.images[i].public_id);
            }

            // Upload new images to Cloudinary
            let imagesLinks = [];
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: 'products',
                    width: 150,
                    crop: "scale",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }

            req.body.images = imagesLinks;
        } else {
            req.body.images = product.images;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product'
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        await product.remove();
        res.status(200).json({
            success: true,
            message: 'Product deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Bulk delete products
exports.bulkDeleteProducts = async (req, res, next) => {
    try {
        const { ids } = req.body;
        await Product.deleteMany({ _id: { $in: ids } });
        res.status(200).json({
            success: true,
            message: 'Products deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.productSales = async (req, res, next) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$itemsPrice" }
            },
            
        },
    ])
    console.log(totalSales)
    const sales = await Order.aggregate([
        { $project: { _id: 0, "orderItems": 1, totalPrice: 1 } },
        { $unwind: "$orderItems" },
		
        {
            $group: {
                _id: { product: "$orderItems.name" },
                total: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
            },
        },
    ])
	
	// return console.log(sales)
    
    if (!totalSales) {
		return res.status(404).json({
			message: 'error sales'
		})
       
    }
    if (!sales) {
		return res.status(404).json({
			message: 'error sales'
		})
      
    }
    
    let totalPercentage = {}
    totalPercentage = sales.map(item => {
         
        // console.log( ((item.total/totalSales[0].total) * 100).toFixed(2))
        percent = Number (((item.total/totalSales[0].total) * 100).toFixed(2))
        total =  {
            name: item._id.product,
            percent
        }
        return total
    }) 
    // return console.log(totalPercentage)
    return res.status(200).json({
        success: true,
        totalPercentage,
        sales,
        totalSales
    })
};

exports.createProductReview = async (req, res, next) => {
	const { rating, comment, productId } = req.body;
	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment
	}
	const product = await Product.findById(productId);
	const isReviewed = product.reviews.find(
		r => r.user.toString() === req.user._id.toString()
	)
	if (isReviewed) {
		product.reviews.forEach(review => {
			if (review.user.toString() === req.user._id.toString()) {
				review.comment = comment;
				review.rating = rating;
			}
		})
	} else {
		product.reviews.push(review);
		product.numOfReviews = product.reviews.length
	}
	product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
	await product.save({ validateBeforeSave: false });
	if (!product)
		return res.status(400).json({
			success: false,
			message: 'review not posted'
		})
	return res.status(200).json({
		success: true
	})
};

exports.getProductReviews = async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    return res.status(200).json({
        success: true,
        reviews: product.reviews
    })
};

exports.deleteReview = async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    const numOfReviews = reviews.length;
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    return res.status(200).json({
        success: true
    })
};

exports.getProductReviews = async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    return res.status(200).json({
        success: true,
        reviews: product.reviews
    })
};