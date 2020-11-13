let mongoose = require('mongoose');

let responseModel = new mongoose.Schema({
    question: String,
    resp: String
});

let answerModel = new mongoose.Schema({
    Name: String,
    Author: String,
    Taker: String,
    resparray: [responseModel]
},
{
    collection: "answers"
});

module.exports = mongoose.model('Response', answerModel);