// User Schema for Authentication using PASSPORT
const User = require('../models/user.js');

module.exports.renderRegister= (req,res)=>{
    res.render('users/register.ejs');
};

module.exports.register = async(req,res,next)=>{

    try{
    const {username, email, password} = req.body;
    
    // creating a new user instance
    const user = await new User({username:username, email:email});
    
    // now we will use passport's method to hash and store password
    const registeredUser = await User.register(user,password);

    // logging in user after registering
    req.login(registeredUser, (err)=>{
        if(err){    // error
            return next(err);
        }else{  // after logging in

            // using flash
            req.flash('success',`Welcome to Yelp Camp ${username}!`);

            res.redirect('/campgrounds');
        }
    })

    } catch(err) {
        req.flash('error',err.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req,res)=>{
    res.render('users/login.ejs');
};

module.exports.login = (req,res)=>{

    // sending user to the page they wanted to go OR if they went to login first so sending to campgrounds
    const redirectUrl = req.session.returnTo || '/campgrounds';

    delete req.session.returnTo // we will delete it so next time it is created again
    // tho redirectUrl holds its value 

    // since user got authenticated so
    req.flash('success','Welcome to Yelp Camp my friend!');

    res.redirect(redirectUrl);
};

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('success','Successfully logged you out!');
    res.redirect('/campgrounds');
};