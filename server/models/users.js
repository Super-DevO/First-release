let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let User = mongoose.Schema(
    {
        username: 
        {
            type: String,
            default: '',
            trim: true,
            required: 'username is required'
        },
        /*
        password:
        {
            type: String,
            default: "",
            trim: true,
            required: 'password is required'
        }
        */
       email:
       {
           type: String,
            default: '',
            trim: true,
            required: 'is required'
       }
    },
    {
        collection: "user"
    }
);

//configure options for the user model
let options = ({missingPasswordError: 'Wrong / Missing Password'});

//this sends the data to passportLocalMongoose
User.plugin(passportLocalMongoose, options);
module.exports.User = mongoose.model('user', User);
