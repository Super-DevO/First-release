let mongoose = require('mongoose');

let response2Model = new mongoose.Schema({
    question: String,
    resp: String
});

let answer2Model = new mongoose.Schema({
    sid: String,
    Name: String,
    Author: String,

    resparray: [response2Model]
},
{
    collection: "answers"
});

module.exports = mongoose.model('Response2', answer2Model);
//module.exports.response2Model = mongoose.model('question2', response2Model);