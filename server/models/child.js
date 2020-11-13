let mongoose = require('mongoose');

let surveyQuestionModel = mongoose.Schema({
    question: String,
    optA: String,
    optB: String,
    optC: String,
    optD: String
});/*
{
    collection: "survey"
});*/

module.exports = mongoose.model('Question', surveyQuestionModel);