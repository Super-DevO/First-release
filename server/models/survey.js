let mongoose = require('mongoose');
let child = require('./child');
const AutoIncrement = require('mongoose-sequence')(mongoose);


let surveyQuestionModel = new mongoose.Schema({
    question: String,
    optA: String,
    optB: String,
    optC: String,
    optD: String
});

let surveyModel = new mongoose.Schema({
    _id: Number,
    Name: String,
    Author: String,
    Description: String,
    Type: String,
    Genera: String,
    quearray: [surveyQuestionModel]
},
{ _id: false },
{
    collection: "survey"
});

surveyModel.plugin(AutoIncrement, {seqID: '_id', start_seq: 200});
module.exports = mongoose.model('Survey', surveyModel);
module.exports.surveyQuestionModel = mongoose.model('question', surveyQuestionModel);