const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');

const schema = mongoose.Schema;

const UserSchema = new schema({
    email:{
        type:String,
        required: true,
        unique:true
    }
})

UserSchema.plugin(passportLocalMongoose);
// this will add on username and passport automatically to the schema
// it is gonna make sure that the user and the password are unique


module.exports = mongoose.model('User', UserSchema);