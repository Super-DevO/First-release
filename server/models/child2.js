let mongoose = require('mongoose');

let response2Model = new mongoose.Schema({
    question: String,
    resp: String
});

module.exports = mongoose.model('ChildResponse2', response2Model);