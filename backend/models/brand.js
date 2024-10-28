const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [20, 'Brand name cannot exceed 20 characters']
    },
    image: {
        public_id: {
            type: String,
            required: false,
        },
        uri: {
            type:String,
            required: false
        }
    }
});

module.exports = mongoose.model('Brand', brandSchema);