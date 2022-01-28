const Campground = require('../models/campground');

// adding MAPBOX for geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapBoxToken = process.env.MAPBOX_TOKEN;

const geocoder = mbxGeocoding({accessToken : mapBoxToken});

// cloudinary to store user added images
const {cloudinary} = require('../cloudinary');

module.exports.index = async function(req,res){
    const campgrounds = await Campground.find({});   // find all 
    res.render('campgrounds/index.ejs',{campgrounds});
};

module.exports.renderNewForm = async function(req,res){
    res.render('campgrounds/new.ejs')
};

module.exports.createCampground = async function(req,res){

    const geoData = await geocoder.forwardGeocode({
        query : req.body.campground.location,   // the location added by user
        limit : 1 // show searches by mapbox
    }).send()

    const campground = new Campground(req.body.campground) // since the data is inside campground object
    
    // getting GeoJSON from the Mapbox by our location and adding it into database
    campground.geometry = geoData.body.features[0].geometry

    // saving images from req.files.path and req.files.filename to use to show and delete
    campground.images = req.files.map((f)=>({ url : f.path,filename : f.filename}));
    // map will create a new array that have an object with keys url and filename 
    // remember to turn it into an object cuz in model we store it in {}

    // saving user's name as a author who created the campground
    campground.author = req.user._id;

    await campground.save();

    // putting the flash 
    req.flash('success','Successfully made a new Campground!')

    res.redirect(`campgrounds/${campground._id}`);   // this is /campground/:id

};

module.exports.showCampground = async function(req,res){

    const campground = await Campground.findById(req.params.id)
        .populate({
            path : 'reviews',
            populate : {   // this is nested populate and so we are populating author inside of the review
                path : 'author'
            }
        })
        .populate('author');
        // populate is used to show the reviews in the campground and not just the id 

    // flash error 
    if(!campground){
        req.flash('error','Cannot find that campground :-(');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs',{campground});
};

module.exports.renderEditForm =async function(req,res){

    const {id}= req.params;
    const campground = await Campground.findById(id);

    // flash error 
    if(!campground){
        req.flash('error','Cannot Edit that campground :-(');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit.ejs',{campground})
};

module.exports.updateCampground= async function(req,res){

    const {id}= req.params
    // finding the campground
 
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground}) // first we find than we update it by spreading(...)
    
    // adding images
    const imgs = req.files.map((f)=>({ url : f.path,filename : f.filename}));
    // since above will add another array into existing array and overrite it but we wanna add it
    // so we will spread the above using ...
    campground.images.push(...imgs);

    if(req.body.deleteImages){  // if this exist means if user selected images to delete
        
        // deleting from cloudinary
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        
        await campground.updateOne({
            $pull : { images : { filename : { $in : req.body.deleteImages } } }
            // PULL(remove) from IMAGES where FILENAME matches REQ.BODY.DELETEIMAGES
        })

    }

    await campground.save();
    


    //flash
    req.flash('success','Successfully Updated Campground');
    
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.deleteCampground= async function(req,res){

    const {id}= req.params
    // finding the campground

    await Campground.findByIdAndDelete(id);

    //flash 
    req.flash('success','Successfully Deleted the Campground!');

    res.redirect('/campgrounds');
};











