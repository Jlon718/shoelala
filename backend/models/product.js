    const mongoose = require('mongoose')

    const productSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Please enter product name'],
            trim: true,
            maxLength: [100, 'Product name cannot exceed 100 characters']
        },
        price: {
            type: Number,
            required:[true, 'Please enter product price'],
            maxlength: [5, 'Product price cannot exceed 5 digits'],
            default:0.0
        },
        description: {
            type: String,
            required: [true, 'Please enter product description']
        },
        ratings: {
            type: Number,
            default: 0
        },
        numOfReviews: {
            type: Number,
            default: 0
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'User',
                    required: true
                },
                name: {
                    type:String,
                    required: true
                },
                rating: {
                    type: Number,
                    required: true
                },
                comment: {
                    type: String,
                    required: true
                }
            }
        ],
        images: [
            {
                public_id: {
                    type: String,
                    required: false
                },
                uri: {
                    type: String,
                    required: false
                },
            }
        ],
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',  
            required: [true, 'Please select category for this product'],
        },
        brand: {
            type:  mongoose.Schema.ObjectId,
            ref: 'Brand',
            required: [true, 'Please select product brand']
        },
        seller: {
            type: mongoose.Schema.ObjectId,
            ref: 'Seller',  
            required: [true, 'Please select category for this product'],
        },
        stock: {
            type: Number,
            required: [true, 'Please enter product stock'],
            maxLength: [5, 'Product stock cannot exceed 5 digits'],
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    })

    module.exports = mongoose.model('Product', productSchema)