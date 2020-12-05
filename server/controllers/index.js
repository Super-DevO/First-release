const { Console } = require('console');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let AutoIncrement = require('mongoose-sequence')(mongoose);
let passport = require('passport');
let url = require('url');

let testSeq = require('../models/testSchema');
let test = testSeq.TestSchema;

let respModel = require('../models/response2');
let Resp2 = require('../models/child2');

let Survey = require('../models/survey');
let NestQuest = Survey.surveyQuestionModel;
let Question = require('../models/child');
let Resp = require('../models/responses');
let StateResp = require('../models/StateResponse');
let StateChildResp = require('../models/stateChild');
let userModel = require('../models/users');
const { RSA_NO_PADDING } = require('constants');
//const { Alert } = require('bootstrap');
let User = userModel.User;
//let local = mongoose.model('local', surveyModel);

//should render ../views/index.ejs//
module.exports.displayHomePage = (req, res, next) => {
    res.render('index', { title: 'Survey' });
}

module.exports.displayLogin = (req, res, next) => {
    if(!req.user)
    {
        console.log("this just ran");
        res.render('login',{
        title: 'Login',
        message: req.flash("User already logged in"),
        displayname: req.user ? req.user.displayname : "Welcome"
    })
    } else {
        console.log(req.err);
        if(req.err)
        {
            return res.redirect('login');
        }
        console.log(req.user);
        return res.redirect('loggedInHome');
    }
    //res.render('login', { title: 'Login' });
}

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local', 
    (err, user, info) => {
        if(err)
        {
            return next(err);
        }
        if(!user)
        {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            if(err){
                return next(err);
            }
            return res.redirect('/loggedInHome');
        });
    })(req, res, next);

}

//edits made here
module.exports.displayEditPage = (req, res, next) => {
    console.log(req.params.id);
    Survey.findById(req.params.id, function (err, currentSurvey) {
        if(err){
            res.render(err);
        } else {
            console.log(currentSurvey.Type);
            if(currentSurvey.Type == 1)
            {
                res.render('edit', { title: 'Edit Your Survey', locSurv: currentSurvey });
            } 
            else if(currentSurvey.Type == 2)
            {
                res.render('edit2', { title: 'Edit Your Survey', locSurv: currentSurvey });
            } 
            else if(currentSurvey.Type == 3) 
            {
                res.render('edit3', { title: 'Edit Your Survey', locSurv: currentSurvey });
            }
            else
            {
                return console.error(err);
            }
        }
    })
}

//this needs to point to the 
module.exports.displayLoginHome = (req, res, next) => {
    res.render('loggedInHome', { title: 'You are now logged in'});
}

module.exports.displayRegister = (req, res, next) => {
    res.render('register', { title: 'Register' });
}

module.exports.processRegister = (req, res, next) => {
    console.log(req.body);
    let tempUser = User({
        username: req.body.username,
        //password
        email: req.body.email,
    });
    try{
        User.register(tempUser, req.body.password, (err) => {
            if(err)
            {
                if(err.name == "UserExistsError"){
                    req.flash(
                        'registerMessage',
                        'Registration Error: User Already Exists!'
                    );
                    console.log("Error: User Already Exists");
                    throw new Error("User already exists");
                }
                return res.render('/register', {
                    title: 'Register',
                    messages: req.flash('register'),
                    displayName: req.user ? req.user.displayname: ''
                });
            }
            else
            {
                //successful registration to the real network page
                return passport.authenticate('local')(req, res, ()=>{
                    res.redirect('/loggedInHome')
                })
            }
        });
    } catch (err) {
        next(err);
    }

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

module.exports.displaySLanding = (req, res, next) => {
    let survey = req.params.id;
    console.log(req.params.id);
    Survey.findById(survey, function (err, locSurv) {
        if(err){
            res.render(err);
        } else {
            console.log(locSurv);
            //res.render('slanding', { title: 'Your Survey', survey: req.params._id });
            if(locSurv.Type == 1)
            {
                res.render('slanding', { title: 'Take Survey', locSurv: locSurv });
            }
            else if(locSurv.Type == 2) 
            {
                res.render('slanding2', { title: 'Take Survey' , locSurv: locSurv });
            }
            else if(locSurv.Type == 3) 
            {
                //res.render(slanding3', { title: 'Take Survey', locSurv: locSurv });
            } else {}
        }
    });
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
            res.render('TakeSurvey', { title: 'TakeSurvey', locSurv: locSurv });
        }
    });
}

module.exports.processSurveyQuestion = (req, res, next) => {
    let surveyID = req.params.id;
    let respArray = [StateChildResp];
    let newStateChild = new StateChildResp;
    //find the survey
    Survey.findById(surveyID, function (err, locSurv) {
        if(err){
            res.render(err);
        } else {
            console.log(locSurv);
            console.log(locSurv.quearray.length);
            let newAnswer = new StateResp({
                'sid': surveyID,
                'Name': locSurv.Name,
                'Author': locSurv.Author,
                'resparray': respArray
            });
            for(let i = 0; i < locSurv.quearray.length; i++)
            {
                newStateChild.question = locSurv.quearray[i].Question;
                newStateChild.qid = locSurv.Question;
                newStateChild.resp = req.body.question[i];
                newAnswer.resparray.push(newStateChild);
            }
            Resp.create(newAnswer, (err, Resp) => {
                if(err)
                {
                    console.log(err);
                    res.end(err);
                } else 
                {
                    console.log('response added');
                    res.redirect('thanks');
                }
            });
        } 
    });
}

module.exports.processSurvey2Question = (req, res, next) => {
    let surveyID = req.params.id;
    let newRespChild = new Resp2;
    let respArray = [Resp2];
    console.log(req.body);
//find the survey that we are associating the ans to
    Survey.findById(surveyID, function (err, locSurv) {
        if(err)
        {
            res.render(err);
        } 
        else 
        {
            newAnswer = new respModel({
                'sid': locSurv._id,
                'Name': locSurv.Name,
                'Author': locSurv.Author,
                'resparray': respArray
            });
//loop through the original questions and create a child 
            console.log(locSurv.quearray.length);
            for(let i = 0; i < locSurv.quearray.length; i++)
            {

                newRespChild.question = locSurv.quearray[i].question;
                //newRespChild.qid = locSurv.quearray[i]._id.toString();
                newRespChild.resp = req.body.dropQuestion[i].toString();
                newAnswer.resparray.push(newRespChild);
            }
            console.log(newAnswer);
            Resp.create(newAnswer, (err, Resp) => {
                if(err)
                {
                    console.log(err);
                    res.end(err);
                } else 
                {
                    console.log('response added');
                    res.redirect('/thanks');
                }
            });
            //res.render('thanks', { title: 'thanks'});
        }
    });
}

module.exports.displayThanks = (req, res, next) => {
    res.render('thanks', { title: "Thanks"});
}

module.exports.displayLeshawn = (req, res, next) => {
    res.render('view1', {title: 'Leshawn'});
}

module.exports.displayListSurvey = (req, res, next) => {
    Survey.find( (err, surveys) => {
        if (err) {
          return console.error(err);
        }
        else {
            console.log(surveys[0]);
            if(surveys == undefined)
            {
                res.render('create', { title: 'Create Survey'} );
            }
            console.log(surveys);
          res.render('list', {
            title: 'Surveys',
            surveys: surveys
          });
        }
      });
    //res.render('list', { title: 'List of Surveys' });
}

//not used
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
    //console.log("ID should be below");
    //console.log(name);
    res.render('survey_question', {title: 'Question Entry', id: name });

   
    //res.render('survey_question', {title: 'Question Entry', name: name });
}

module.exports.displayQuestionEntry2 = (req, res, next) => {
    let name = req.params.name;
    //console.log("ID should be below");
    //console.log(name);
    res.render('survey_question2', {title: 'Question Entry', id: name });

   
    //res.render('survey_question', {title: 'Question Entry', name: name });
}

module.exports.displayQuestionEntry3 = (req, res, next) => {
    let name = req.params.name;

    res.render('survey_question3', {title: 'Question Entry', id: name });

   
    //res.render('survey_question', {title: 'Question Entry', name: name });
}

//may be the old version of the survey porcessor
module.exports.processSurvey = (req, res, next) => {
//must be changed to auto add the personal stuff
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

//add questions
module.exports.processQuestionAdd = (req, res, next) => {
    let name = req.params.name;
    console.log(req.body.Question);
    let newQuestion = Question({
        "question": req.body.Question,
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

//to add the mc questions
module.exports.processQuestionAdd2 = (req, res, next) => {
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
                        'pathname': '/survey_question2/' + name
                    }));
                }
            }); 
        }
    })
}

//to process the heat questions
module.exports.processQuestionAdd3 = (req, res, next) => {
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

//adds a new survey
module.exports.processNewSurvey = (req, res, next) => {
    //console.log(req.body.Name);
    let newSurvey = Survey({
        "Name": req.body.Name,
        "Author": req.body.Author,
        "Description": req.body.Description,
        "Type": req.body.surveyType
       // "quearray": null
    });
    Survey.find((err, surveyList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            for(let i = 0; i < surveyList.length; i++)
            {
                if(surveyList[i].Name == req.body.Name)
                {
                    res.render('/loggedInHome', { title: 'Your are now Logged In'});
                }
            }
        }
    });
    //TODO: verify that the name is not in use already
    //TODO: differentiate that the correct user can only see their surveys
    let que = req.query;
    console.log(que);
    console.log(req.body);
    Survey.create(newSurvey, (err, Survey) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        } else 
        {
            let name = req.body.Name;
            if(req.body.surveyType == 1)
            {
                res.redirect(url.format({
                    pathname: '/survey_question/' + req.body.Name
                }));
            }
            else if(req.body.surveyType == 2)
            {
                res.redirect(url.format({
                    pathname: '/survey_question2/' + req.body.Name
                }));
            }
            else if(req.body.surveyType == 3)
            {
                res.redirect(url.format({
                    pathname: '/survey_question3/' + req.body.Name
                }));
            }
        }
    });

}

//will list the surveys of individual users
module.exports.displayYlist = (req, res, next) => {
    console.log(req.user);
    
    let list_to_go = [Survey];
    let j = 1;
    //build an array of Surveys and pass it to the file
    try
    {
        Survey.find( (err, surveys) => {
            if (err) {
              return console.error(err);
            }
            else {
                for(i = 0; i < surveys.length; i++)
                {
                    
                    if(surveys[i].Author === req.user.username)
                    {
                        console.log(surveys[i].Name + " added");
                        list_to_go.push(surveys[i]);
                        
                    }
                }
                console.log(list_to_go);
                for(m = 1; m < list_to_go.length; m++)
                {
                    console.log(m);
                    console.log(list_to_go[m].Name);
                }
              res.render('ylist', {
                title: 'Your Surveys',
                surveys: list_to_go
              });
            }
          });
    } catch {
        res.render('/index', { title: "Home Page"});
    }
    
}

//lists the results of a survey
module.exports.displayResults1 = (req, res, next) => {
    let locSurv;
    
    let sid = req.params.id;
    console.log('survey ID: ' + sid);
    try{
        Survey.findById(sid, function (err, locSurv) {
            if(err)
            {
                return console.error(err);
            }
            else
            {
                console.log(locSurv);
                let respArray = [[StateResp]];
                //get the answers and compare ids
                let surveyName = locSurv.Name;
                console.log('survey to check ' + surveyName);
                //find all surveys
                Resp.find((err, surveyList) => {
                    if(err)
                    {
                        return console.error(err);
                    }
                    else
                    {
                        //console.log('found ' + surveyList.length + ' with the name ');
                        if(surveyList.length == 0)
                        {
                            res.redirect('ylist', { title: "Your Surveys"});
                        }
                        for(let i = 0; i < surveyList.length; i++)
                        {
                            //console.log(surveyList[i].Name);
                            console.log(surveyList[i].resparray);
                            if(surveyList[i].Name == surveyName){
                                //do we dont need an array because its a double array
                                respArray.push(surveyList[i].resparray);
                            }
                        }
                        //console.log('found ' + respArray.length);
                        //console.log('its ' + respArray[0]);
                        if(respArray.length == 1)
                        {
                            res.render('login', {title: 'Login'});
                        }
                        res.render('results1', { title: 'Results', RespList: respArray, survey: locSurv });
                    }
                });
            }
        })     
    } catch {
        res.render('/ylist', { title: 'Your Surveys'});
    }
   
   // res.render('results1', { title: 'Results', RespList: respArray });

}

//removes an individual quesiton from a survey - not working
module.exports.deleteQuestion = (req, res, next) => {
    console.log(req.params.id);
    let id = req.params.id;
    let questID;

    let index = id.split("-", 2);
    let indexNum = index[1];
    console.log(index[0]);//the survey ID
    let newQuest = new Question;
    let newSurvey = new Survey({
        
    }); 
    Survey.findById(index[0], function (err, locSurv) {
        if(err){
            res.render(err);
        } else {
            let surveyID = locSurv._id;
            //console.log(locSurv.quearray);
            questID = locSurv.quearray[indexNum]._id;
            //console.log("the one to delete: " + questID);
            newSurvey._id = locSurv._id;
            newSurvey.Name = locSurv.Name;
            newSurvey.Author = locSurv.Author;
            newSurvey.Type = locSurv.Type;
            newSurvey.Description = locSurv.Description;

            for(let i = 0; i < locSurv.quearray.length; i++){
                if(locSurv.quearray[i].question != null){
                    newQuestion = locSurv.quearray[i];
                    newSurvey.quearray.push(newQuestion);
                }
            }
            Survey.deleteOne({_id: surveyID}, (err) => {
                if(err)
                {
                    console.log(err);
                    res.end(err);
                }
                else
                {
                    console.log(locSurv.quearray);
                    // now create new survey
                    Survey.create(newSurvey, (err, Survey) => {
                        if(err)
                        {
                            console.log(err);
                            res.end(err);
                        }
                        else
                        {
                            // refresh the network list
                            res.redirect('/ylist');
                        }

                    });
                    //res.redirect('/edit/' + locSurv._id);
                }
        
            });
        }
    });

}

//to edit questions - We dont need this one
module.exports.editQuestion = (req, res, next) => {
    //console.log(req.params.id);
    //console.log(req.body);
    let id = req.params.id;

    let index = id.split("-", 2);
    let indexNum = index[1];
    let updatedQuestion = new Question({
        'question': req.body.username
    });
    console.log('id of survey: ' + index[0]);
    console.log('position of Question in array: ' + index[1]);
    Survey.findById(index[0], function (err, locSurv) {
        if(err){
            res.render(err);
        } else {
            
            console.log(locSurv.quearray[index[1]]);
            //console.log(locSurv.quearray[indexNum].id);
           /* Question.updateOne({_id: locSurv.quearry[indexNum]._id}, updatedQuestion, (err) => {
                if(err)
                {
                    return console.error(err);
                }
                else
                {
                    console.log('worked');
                }
            });*/
            res.render('alterStatement', { title: 'Edit Your Survey', locSurv: locSurv.quearray[index[1]] });
        }
    });
    //res.render('edit', { title: 'Edit Your Survey', survey: index[0] });

}

module.exports.displayEditQuestionEntry = (req, res, next) => {

    let id = req.params.id;

    let index = id.split("-", 2);
    let indexNum = index[1];
    let updatedQuestion = new Question({
        'question': req.body.username
    });
    console.log('id of survey: ' + index[0]);
    console.log('position of Question in array: ' + index[1]);
    Survey.findById(index[0], function (err, locSurv) {
        if(err){
            res.render(err);
        } else {
            
            console.log(locSurv.quearray[index[1]]);
            //console.log(locSurv.quearray[indexNum].id);
           /* Question.updateOne({_id: locSurv.quearry[indexNum]._id}, updatedQuestion, (err) => {
                if(err)
                {
                    return console.error(err);
                }
                else
                {
                    console.log(rs'worked');
                }
            });*/
            res.render('alterStatement', { title: 'Edit Your Survey', locSurv: locSurv.quearray[index[1]] });
        }
    });
}

module.exports.displayEditListMC = (req, res, next) => {

}

module.exports.displayAlterMC = (req, res, next) => {
    let id = req.params.id;

    let index = id.split("-", 2);
    let indexNum = index[1];
    let updatedQuestion = new Question({
        'question': req.body.username
    });
    console.log('id of survey: ' + index[0]);
    console.log('position of Question in array: ' + index[1]);
    Survey.findById(index[0], function (err, locSurv) {
        if(err){
            res.render(err);
        } else {
            
            console.log(locSurv.quearray[index[1]]);
            res.render('alterMC', { title: 'Edit Your Question', locSurv: locSurv.quearray[index[1]] });
        }
    });
}

module.exports.processNewStatement = (req, res, next) => {
    console.log(req.body);
    let id = req.params.id;
    console.log("processing survey quesiton");
    let tempQarray = [NestQuest];//not rendered
    let newQarray = [NestQuest];//will pass to db
    let newQuest = new NestQuest({
        "question": req.body.NewQuest
    });
    let index = id.split("-", 2);
    let indexNum = index[1];
    let surveyID = index[0];
    
    console.log('survey ID: ' + surveyID);
    Survey.findById(surveyID, function (err, locSurv) {
        if(err){
            res.render(err);
        } else {
            let questID = locSurv.quearray[indexNum]._id;
            console.log(questID);
            console.log();
            tempQarray = locSurv.quearray;

            for(let i = 0; i < tempQarray.length; i++) 
            {
                console.log(tempQarray[i]._id);
                console.log(questID);
                if(tempQarray[i]._id != questID)
                {
                    newQarray.push(tempQarray[i]);
                } else {
                    newQuest._id = tempQarray[i].id;
                    console.log(newQuest);
                    newQarray.push(newQuest);
                }
            }
            console.log('\n' + newQarray);
            //now we have the updated array so call update
            let newSurvey = new Survey({
                "_id": surveyID,
                "Name": locSurv.Name,
                "Author": locSurv.Author,
                "Description": locSurv.Description
                //"quearray": newQarray
            });
            for(let j = 0; j < newQarray.length; j++)
            {
                newSurvey.quearray.push(newQarray[j]);
            }
            Survey.updateOne({_id: surveyID}, newSurvey, (err) => {
                if(err)
                {
                    console.log(err);
                    res.end(err);
                }
                else
                {
                    res.redirect('/edit/' + surveyID);
                }
            });
        }
    });
}

module.exports.processAlterMC = (req, res, next) => {
    console.log(req.body);
    let id = req.params.id;
    console.log("processing survey question");
    let tempQarray = [NestQuest];//not rendered
    let newQarray = [NestQuest];//will pass to db
    let newQuest = new NestQuest({
        "question": req.body.NewQuest,
        "optA": req.body.optA,
        "optB": req.body.optB,
        "optC": req.body.optC,
        "optD": req.body.optD
    });
    let index = id.split("-", 2);
    let indexNum = index[1];
    let surveyID = index[0];

    Survey.findById(surveyID, function (err, locSurv) {
        if(err){
            res.render(err);
        } 
        else 
        {
            let questID = locSurv.quearray[indexNum]._id;
            tempQarray = locSurv.quearray;
            //adds the questions and subs in the new one
            for(let i = 0; i < tempQarray.length; i++) 
            {
                console.log(tempQarray[i]._id);
                console.log(questID);
                if(tempQarray[i]._id != questID)
                {
                    newQarray.push(tempQarray[i]);
                } else {
                    newQuest._id = tempQarray[i].id;
                    console.log(newQuest);
                    newQarray.push(newQuest);
                }
            }
            //creates a new survey
            let newSurvey = new Survey({
                "_id": surveyID,
                "Name": locSurv.Name,
                "Author": locSurv.Author,
                "Description": locSurv.Description
                //"quearray": newQarray
            });
            //pushes all entries from new array to question
            for(let j = 0; j < newQarray.length; j++)
            {
                newSurvey.quearray.push(newQarray[j]);
            }
            //updates the question
            Survey.updateOne({_id: surveyID}, newSurvey, (err) => {
                if(err)
                {
                    console.log(err);
                    res.end(err);
                }
                else
                {
                    res.redirect('/edit/' + surveyID);
                }
            });
        }
});
}

//Logged in - deletes a survey
module.exports.performDelete = (req, res, next) => {
    let id = req.params._id;
    Survey.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
             // refresh the user's list
             res.redirect('/ylist');
        }
    });
}

module.exports.performLogout = (req, res, next) => {
    console.log("logging out");
    req.logout();
    res.redirect('/');
}

module.exports.testSeqtest = (req, res, next) => {

    let t = new test ({
        'name': "test is working"
    });
    test.create(t, (err, Survey) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // refresh the network list
            res.redirect('/');
        }

    });
}

