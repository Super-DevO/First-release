let mongoose = require('mongoose');

let stateChildRespModel = new mongoose.Schema({
    question: String,
    qid: String,
    resp: String
});

module.exports = mongoose.model('stateChildResp', stateChildRespModel);