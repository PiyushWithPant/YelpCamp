const express = require('express');
const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds.js')
const {isLoggedIn, isAuthor,validateCampground} = require('../middleware.js');

// multer - parser for image files 
const multer = require('multer');

// importing cloudinary files
const {storage} = require('../cloudinary/index.js'); 

// using the multer to parse and upload the file to a DESTINATION
const upload = multer({storage})


// We will use Router to organize our routes nicly

// first we need to call the Router 
const router = express.Router();



// campground
router.get('/', catchAsync(campgrounds.index));

// campground/new
router.get('/new',isLoggedIn , campgrounds.renderNewForm);


// post request for new campground
router.post('/',isLoggedIn , upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
// MAKE SURE THAT THE ORDER OF YOUR CODE IS CORRECT OTHERWISE YOU WILL GET ERRORS
// SHOW SHOULD BE BELOW THAN NEW CUZ SHOW WILL SEARCH FOR ANY ID AND IT WILL TAKE EVEN NEW

    // validateCampground is a middleware function which will check the validation and if true, will send to next callback to create that campground
    // the above validation code will give error and new campground will not be created and so 
    // we didn't let the problem pass on to the mongo

// campground/show
router.get('/:id', catchAsync(campgrounds.showCampground));

// campgrounds/:id/edit
router.get('/:id/edit',isLoggedIn , isAuthor ,catchAsync(campgrounds.renderEditForm));

// campground patch/put
router.put('/:id',isLoggedIn ,isAuthor, upload.array('image'), validateCampground ,catchAsync(campgrounds.updateCampground));

// camground delete
router.delete('/:id', isLoggedIn ,isAuthor ,catchAsync(campgrounds.deleteCampground));

// exporting the routes to our main files

module.exports = router;
