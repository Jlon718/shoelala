const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [20, 'Categoy name cannot exceed 20 characters']
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

module.exports = mongoose.model('Category', categorySchema);