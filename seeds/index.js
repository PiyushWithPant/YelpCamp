// this file is to have initial data into our yelp camp
// seeds means having initial or pre data to work on so here we will connect our cities and seedhelper files
// to add them in database

const mongoose = require('mongoose');

// importing the cities files 
const cities = require('./cities.js');

// importing the seedhelper files
const { places, descriptors} = require('./seedHelpers.js');

// importing mongo model
const campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{useNewUrlParser:true,useUnifiedTopology:true})

const db = mongoose.connection;
    db.on('error',()=>{
        console.error.bind(console,"CONNECTION ERROR :-(");
    })
    db.once('open',()=>{
        console.log("CONNECTED TO DATABASE...")
    })


// function to get a random index of the array
const sample = (array)=>{
    return array[Math.floor(Math.random() * array.length)]
}

const seedDb = async ()=>{
    // to delete garbage data that already exist
    await campground.deleteMany({});

    for(let i = 0; i<50; i++){
        const random = Math.floor( Math.random() * 1000 ) + 1 ;

        const randomPrice= Math.floor(Math.random() * 100)+10;

        const place = cities[random];

        // extracting that city's coordinates
        const placeLatitude = place.latitude  
        const placeLongitude = place.longitude 
        const camp = new campground ({
            author : '61ea6cd4ffac68c2850e05b4',
            location : `${place.city}, ${place.state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description : "This is a wonderful place to spend your Vacations and spend quality time with loved ones !",
            price : randomPrice,
            geometry :{
                type : "Point",
                coordinates : [placeLongitude,placeLatitude]
            }, 
            images : [ 
                { 
                    "url" : "https://res.cloudinary.com/saiyangoku/image/upload/v1642950712/YelpCamp/jmbojbrcyfjmsnt9ie6t.jpg", 
                    "filename" : "YelpCamp/jmbojbrcyfjmsnt9ie6t" 
                }, 
                { 
                    "url" : "https://res.cloudinary.com/saiyangoku/image/upload/v1642950714/YelpCamp/re9lzyytnii7tf8arm7m.jpg", 
                    "filename" : "YelpCamp/re9lzyytnii7tf8arm7m" 
                }, 
                { 
                    "url" : "https://res.cloudinary.com/saiyangoku/image/upload/v1642950715/YelpCamp/icbzaydpytoiezoqpzpe.jpg", 
                    "filename" : "YelpCamp/icbzaydpytoiezoqpzpe" 
                }, 
                { 
                    
                    "url" : "https://res.cloudinary.com/saiyangoku/image/upload/v1642950716/YelpCamp/cf7u7qbpwq1lxwawvhnt.jpg", 
                    "filename" : "YelpCamp/cf7u7qbpwq1lxwawvhnt" 
                }, 
                { 
                    
                    "url" : "https://res.cloudinary.com/saiyangoku/image/upload/v1642950718/YelpCamp/ozh0k2gvd9mdv2gsbgwi.jpg", 
                    "filename" : "YelpCamp/ozh0k2gvd9mdv2gsbgwi" 
                } 
            ]
            // this is an api which generate a new image each time called
        })

        await camp.save();

    }
}

seedDb()
    .then(()=>{
        mongoose.connection.close();
    })