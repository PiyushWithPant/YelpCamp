const Campground = require('../models/campground');
const Review = require('../models/review.js');

module.exports.createReview = async function(req,res){
    const {id} = req.params;
    const campground = await Campground.findById(id);

    
    //now we will save the review made by the user 
    const review = new Review( req.body.review );
    
    // saving author as whoever is logged in to create a review
    review.author = req.user._id;
    // since the new review is saved in the Review model
    // and the Review model is connected to the campground model via reviews
    // so we will push the new review to reviews
    campground.reviews.push(review);    // we will use push cuz the reviews is defined as an array in campground models
    
    // Saving
    await review.save();
    await campground.save();

    // flash
    req.flash('success','Succesfully created a Review!');
    
    // After saving the review, we will redirect to the show page
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async function(req, res){

    const {id , reviewId} = req.params;

    // finding and updating the campground
    await Campground.findByIdAndUpdate(id , { $pull : { reviews : reviewId}});
    // the PULL operator will pull out the reviewId from the reviews key

    // finding and deleting the review from review model
    await Review.findByIdAndDelete(reviewId);

    // flash 
    req.flash('success','Review Deleted!');

    res.redirect(`/campgrounds/${id}`);

};