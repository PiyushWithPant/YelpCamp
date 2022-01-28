//* This code is for replacement of TRY AND CATCH method
// this is error handling method for asynchronous functions

module.exports = function(func){

    return function( req,res,next ){
        func(req,res,next).catch(next);
    
    }
}