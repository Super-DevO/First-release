let mongoose = require('mongoose');

let responseModel = new mongoose.Schema({
    question: String,
    qid: String,
    resp: String
});

let stateRespModel = new mongoose.Schema({
    sid: Number,
    Name: String,
    Author: String,
    SomeShit: String,
    resparray: [responseModel]
},
{
    collection: "answers"
});

module.exports = mongoose.model('stateResponse', stateRespModel);