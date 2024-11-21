const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dop23iret', 
    api_key: '918432533472176', 
    api_secret: 'noaPEZq97pPZHGtu-A_XuD4LQcw'
});

module.exports = cloudinary;
