const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage}= require('multer-storage-cloudinary');

// configuring our cloudinary to use it later as per our needs 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
});

// creating a new instance
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // our configured cloudinary with info about our cloudinary account
    params: {
        folder : 'YelpCamp',
        allowedFormat : ['jpeg', 'jpg', 'png']
    }
});

module.exports = {
    cloudinary, // our configured cloudinary with info about our cloudinary account
    storage // our created instance to store that kinda files 
}