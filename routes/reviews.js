const express = require('express');

// Review Model
const Review = require('../models/review');
// Campground Model
const Campground = require('../models/campground');
  
const router = express.Router({ mergeParams: true });
// when we use routers, the param of req.param cannot be accessed normal way so 
// we need to merge the param to req when we use router in order to use req.param here

// importing the controller
const reviews = require('../controllers/reviews.js');


const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError');

// middlewares
const {validateReview,isLoggedIn, isReviewAuthor} = require('../middleware.js');


// posting review for a campground
router.post('/',isLoggedIn ,validateReview ,catchAsync(reviews.createReview));

// To delete a Review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor ,catchAsync(reviews.deleteReview));


module.exports = router;