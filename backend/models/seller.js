const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [25, 'Seller name cannot exceed 20 characters']
    },
    address: {
        type: String,
        required: true,
        maxLength: [50, 'Address cannot exceed 20 characters']
    }
})

module.exports = mongoose.model('Seller', sellerSchema)