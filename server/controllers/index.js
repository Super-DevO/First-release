const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let url = require('url');

let Survey = require('../models/survey');
let Question = require('../models/child');
let Resp = require('../models/responses');
//let local = mongoose.model('local', surveyModel);

//should render ../views/index.ejs//
module.exports.displayHomePage = (req, res, next) => {
    res.render('index', { title: 'Survey' });
}

module.exports.displayLogin = (req, res, next) => {
    res.render('login', { title: 'Login' });
}

module.exports.displayInstruction = (req, res, next) => {
    res.render('instructions', {title: 'Instructions'});
}

module.exports.displaySurvey = (req, res, next) => {
    //find the survey by name that we must pass to this route
    let survey = req.params.id;
    console.log(survey);
    Survey.findById(survey, function (err, locSurv) {
        if(err){
            res.render(err);
        } else {
            console.log(locSurv);
            res.render('takeSurvey', { title: 'TakeSurvey', locSurv: locSurv });
        }
    })
}

module.exports.displayListSurvey = (req, res, next) => {
    Survey.find( (err, surveys) => {
        if (err) {
          return console.error(err);
        }
        else {
          res.render('list', {
            title: 'Surveys',
            surveys: surveys
          });
        }
      });
    //res.render('list', { title: 'List of Surveys' });
}

module.exports.deleteSurvey = (req, res, next) => {
    let id = req.body.id;
    Survey.remove({_id: id}, (err) => {
        if(err)
        {
            res.end(err);
        }
        else
        {
            res.redirect('/list');
        }
    });
}

module.exports.displayQuestionEntry = (req, res, next) => {
    let name = req.params.name;
    console.log("ID should be below");
    //console.log(name);
    res.render('survey_question', {title: 'Question Entry', id: name });

   
    //res.render('survey_question', {title: 'Question Entry', name: name });
}

module.exports.processSurvey = (req, res, next) => {
    let newResp = Resp({
        "Name": 'steve',
        "Author": 'steve',
        "Taker": 'mike',
       // "quearray": null
    });
    console.log(newResp);
    Resp.create(newResp, (err, Resp) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        } else 
        {
            console.log('response added');
           // res.redirect('/thanks');
        }
    });
    res.render('thanks', { title: 'thanks'});
}


module.exports.processQuestionAdd = (req, res, next) => {
    let name = req.params.name;
    console.log(req.body.Question);
    let newQuestion = Question({
        "question": req.body.Question,
        "optA": req.body.optA,
        "optB": req.body.optB,
        "optC": req.body.optC,
        "optD": req.body.optD
    });

    Survey.findOne({ 'Name': name }, (err, tempSurvey) => {
        if(err){
            res.send(err);
        } else {
            //console.log(tempSurvey);
            tempSurvey.quearray.push(newQuestion);
            //console.log(tempSurvey);
            Survey.updateOne({ _id: tempSurvey._id}, tempSurvey, (err) => {
                if(err)
                {
                    console.log(err);
                    res.end(err);
                }
                else
                {
                    console.log("question added");
                    res.redirect(url.format({
                        'pathname': '/survey_question/' + name
                    }));
                }
            }); 
        }
    })
}


module.exports.displayUserPage = (req, res, next) => {
    res.render('user', { title: 'User Local' });
}

module.exports.displayCreateSurvey = (req, res, next) => {
    res.render('create', { title: 'Create Survey' });
}
//below is the post for create survey - do this with the added feature
module.exports.processNewSurvey = (req, res, next) => {
    //console.log(req.body.Name);
    let newSurvey = Survey({
        "Name": req.body.Name,
        "Author": req.body.Author,
        "Description": req.body.Description,
       // "quearray": null
    });
    //TODO: verify that the name is not in use already
    //TODO: differentiate that the correct user can only see their surveys
    Survey.create(newSurvey, (err, Survey) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        } else 
        {
            let name = req.body.Name;
            res.redirect(url.format({
                pathname: '/survey_question/' + req.body.Name
            }));
        }
    });

}

