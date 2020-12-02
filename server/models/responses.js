let mongoose = require('mongoose');

let responseModel = new mongoose.Schema({
    question: String,
    resp: String
});

let answerModel = new mongoose.Schema({
    sid: String,
    Name: String,
    Author: String,

    resparray: [responseModel]
},
{
    collection: "answers"
});

module.exports = mongoose.model('Response', answerModel);