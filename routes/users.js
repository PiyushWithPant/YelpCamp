const express = require('express');

const passport = require('passport');

const User = require('../models/user.js');

const catchAsync = require('../utils/catchAsync.js');

const router = express.Router();

// controllers file
const users = require('../controllers/users.js');

// to register

router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.register));

// to login

router.get('/login', users.renderLogin);

// we will use a middleware by passport to authenticate a user and if that we proceed to next callback
// it means user is authenticated 
router.post('/login',passport.authenticate('local', {failureFlash:true,failureRedirect:'/login'}), users.login);

router.get('/logout',users.logout);


module.exports = router;
