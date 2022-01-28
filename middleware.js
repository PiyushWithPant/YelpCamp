const {campgroundSchema,reviewSchema} = require('./schemas.js'); // schema for joi validation
const ExpressError = require('./utils/ExpressError.js');
const Campground = require('./models/campground.js')
const Review = require('./models/review.js')


module.exports.isLoggedIn = (req,res,next) => {

    if(!req.isAuthenticated()){ // if not authenticated, then error

        // sending user where they wanted to go before loggin in 
        req.session.returnTo = req.originalUrl;

        req.flash('error','You must be logged in');
        return res.redirect('/login');
    }
    else{   // if authenticated, then to next callback
        next();
    }

};


// validation function for campground creation and editing 
module.exports.validateCampground= function(req, res, next) {

    // using JOI to check the validity of the data entered by user before it goes to mongo
    // so needs to create a schema (already created in schema.js file)
    const {error } = campgroundSchema.validate(req.body)
    // validating the data using the JOI schema

    // passing info to user to tell the error
    if(error){ // if it is true means there is an error

        const msg = error.details.map((element)=>{  
            // since details is an array, so we will access its element using array map method
            return element.message
        }).join(',')

        throw new ExpressError( msg, 400)
    } else{
        next(); // will go to next call back if no error
    }
};

module.exports.isAuthor = async (req,res,next) => {
    const {id}= req.params;
    const campground = await Campground.findById(id);
    // verifying that the campground belong to the user(only then they can edit if they are the author of it)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that ');
        return res.redirect(`/campgrounds/${id}`);
    } 
    next();
};

// validation function for review creation and editing
module.exports.validateReview = function(req,res,next){
    
    const {error} = reviewSchema.validate(req.body);
    
    if(error){
        const msg = error.details.map((element)=>{
            return element.message
        }).join(',')
        throw new ExpressError( msg, 400)
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
    const {id,reviewId}= req.params;
    const review = await Review.findById(reviewId);
    // verifying that the campground belong to the user(only then they can edit if they are the author of it)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that ');
        return res.redirect(`/campgrounds/${id}`);
    } 
    next();
};
