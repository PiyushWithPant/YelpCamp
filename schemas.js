//* this file is JOI schema file to validate data entered by the user to handle errors in express

const baseJoi = require('joi');

// now we will have to secure our website so that no one can include their script to our webpage
// so we will define an extension to make it safer

const sanitizeHtml = require('sanitize-html')

// defining our extension
const extension = (joi)=>({
    type : 'string',
    base : joi.string(),
    messages:{
        'string.escapeHTML':'{{#label} must not include HTML!}'
    },
    rules:{
        escapeHTML:{
            validate(value, helpers){
                const clean = sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{}
                });
                if(clean !==value) return helpers.error('string.escapeHTML',{value})
                return clean
            }
        }
    }
});

// adding our extension

const Joi = baseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground : Joi.object({
        title : Joi.string().required().escapeHTML(),
        // images : Joi.string().required(),
        location : Joi.string().required().escapeHTML(),
        description : Joi.string().required().escapeHTML(),
        price : Joi.number().required().min(0)
    }).required(),
    deleteImages : Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body : Joi.string().required().escapeHTML()
    }).required()
});
