const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// creating schema
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author :{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
});

// creating the model from the schema and making a collection called as Review which will be pluralized into reviews in mongo
const Review = mongoose.model('Review', reviewSchema);

// since we are going to connect the respective reviews to their campgrounds so 
// this will be one to many relationship

module.exports = Review;