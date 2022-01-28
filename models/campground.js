const mongoose = require('mongoose');
const Review = require('./review');

const schema = mongoose.Schema;



const ImageSchema = new schema({
        url : String,
        filename : String
})


// now we will create a virtual so that we can get image of pixels 200 only using Cloudinary APIs
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

// for MAP popups
const opts={ toJSON : {  virtuals : true } };

const CampgroundSchema = new schema({
    title : String,
    geometry : {    // GeoJSON
        type :{
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates:{
            type : [Number],    // array of numbers
            required : true
        }
    },
    location : String,
    price : Number,
    images : [ImageSchema],
    description : String,
    author :{
        type : schema.Types.ObjectId,
        ref : 'User'  
    },

    // creating the relationship with another REVIEW model
    reviews : [
        // since the relationship between campground and models is ONE TO MANY so we will store in array
            {
            type : schema.Types.ObjectId,
            ref : 'Review'
            }
    ]
    
}, opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
})  

// when we delete a campground, its Reviews are not deleted in the mongo
// so now we will write program to delete both at once 

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.remove({
            _id : {
                $in : doc.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;
