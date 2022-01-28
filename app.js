if(process.env.NODE_ENV !== 'production'){  // if we are not in production mode means we are in development mode then
    require('dotenv').config();
}

const express = require('express');
const app = express();

const path = require('path');

const mongoose = require('mongoose');

// Campground Model
const Campground = require('./models/campground');

// Review Model
const Review = require('./models/review');

// User Schema for Authentication using PASSPORT
const User = require('./models/user.js');

const methodOverride = require('method-override');

// sessions 
const session = require('express-session');

// our mongo session store
mongoDbStore = require("connect-mongo");

// lets us create partials, boilerplate etc and add css in ejs files
const ejsMate = require('ejs-mate');

// using our Mongo santizier to secure our webApp from injection attacks
const mongoSanitize = require('express-mongo-sanitize');

// helmet - security for headers
const helmet = require('helmet');


// flash
const flash = require('connect-flash');

// passports
const passport = require('passport')
const localStrategy = require('passport-local');


// data validator for js

const {campgroundSchema,reviewSchema} = require('./schemas'); // schema for joi validation

// function that catches errors in async functions, replacement to TRY and CATCH
const catchAsync = require('./utils/catchAsync.js');
const ExpressError = require('./utils/ExpressError');

//* IMPORTING ROUTES

const campgroundRoutes = require('./routes/campground.js');  
const reviewRoutes = require('./routes/reviews.js');  
const userRoutes = require('./routes/users.js'); 


// our cloud database
// const dbUrl = process.env.DB_URL 
// Global cloud database - process.env.DB_URL
// local database - 'mongodb://localhost:27017/yelp-camp'
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp' 

mongoose.connect(dbUrl,{useNewUrlParser:true, useUnifiedTopology:true})
    // .then(()=>{
    //     console.log('Connected to Database...')
    // })
    // .catch((e)=>{
    //     console.log('ERROR: Could not connect to Database...')
    //     console.log(e)
    //      OR  })

const db = mongoose.connection;
    db.on('error',()=>{
        console.error.bind(console,"CONNECTION ERROR :-(");
    })
    db.once('open',()=>{
        console.log("CONNECTED TO DATABASE...");
    })


const secret = process.env.SECRET || "ohShitMyProductionSecretDidNotWorkCrappppp"


app.engine('ejs',ejsMate);

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

//when we send a post request then we cannot access its " req.body " unless we parse it and so
// we have to use body parser
app.use(express.urlencoded({extended:true}));
// now if we print req.body we will get it

// for method-override
app.use(methodOverride("_method"));

// to serve the static files
app.use(express.static(path.join(__dirname,'public')));

// using our santizer
app.use(mongoSanitize());

// using helmet
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
    "https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js",
    "https://www.mapbox.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css",
    "https://api.mapbox.com/styles/v1/mapbox/dark-v10",
    "https://api.mapbox.com/styles/v1/mapbox/streets-v11",
    "https://www.mapbox.com/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://www.mapbox.com/"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/saiyangoku/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://res.cloudinary.com/saiyangoku/image/upload/v1642950712/YelpCamp/"
                
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


// creating mongo store to store session
const store = mongoDbStore.create({
    mongoUrl: dbUrl,
    secret:secret,
    touchAfter: 24*60*60 // One day (time in seconds)
    // touchAfter means, save session one time at given time
})

// session
const sessionConfig= { 
    store : store,  // our mongo session store
    secret : secret,
    resave : false,
    saveUninitialized: true,
    cookie : {
        // we want our cookie to expire in 1 week so as we know that date is stored in Milisecond format in js
        // one second have 1000ms and so one week will have 
        // 1000 * 60 * 60 * 24 * 7
        expires : Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true, // this is for security so that third party cannot access it
        // secure:true
    }
}
app.use(session(sessionConfig));

app.use( flash() );

// defining a middleware so that we can access flashes in all files 
app.use((req,res, next) => {

    // creating global variable even tho they are called locals


    // flash
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');



    next();
})

//using passport - remember to write this after using sessions always
app.use(passport.initialize());
app.use(passport.session());

// using passport-local through passport and authenticating the user
passport.use(new localStrategy(User.authenticate()));

// now we will serialize user means storing user in session (logged in)
passport.serializeUser(User.serializeUser());

// now we will deserialize user means Unstoring user in session (logged out)
passport.deserializeUser(User.deserializeUser());

// passport middleware ( put after using passports)
app.use(function(req, res, next){
    // creating a global var to access from all templates which store user info
    res.locals.currentUser = req.user;

    next();
});

//* USING OUR ROUTES

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);


// home page 
app.get('/',(req,res)=>{
    res.render('home')
});




app.all('*',(req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND',404));
});


//* Error handler
app.use((err,req,res,next)=>{
    // destructuring from err and putting default values
    const{statusCode=500}=err;

    if(!err.message) err.message = " Oh Boy! Something Went Wrong :-("
    res.status(statusCode).render('error.ejs',{err});

});

app.listen(8080,()=>{
    console.log('LISTENING AT PORT 8080');
});  

