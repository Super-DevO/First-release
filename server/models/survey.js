let mongoose = require('mongoose');
let child = require('./child');

let surveyQuestionModel = new mongoose.Schema({
    question: String,
    optA: String,
    optB: String,
    optC: String,
    optD: String
});

let surveyModel = new mongoose.Schema({
    Name: String,
    Author: String,
    Description: String,
    Type: String,
    Genera: String,
    quearray: [surveyQuestionModel]
},
{
    collection: "survey"
});

module.exports = mongoose.model('Survey', surveyModel);
module.exports.surveyQuestionModel = mongoose.model('question', surveyQuestionModel);