let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');

/* GET Landing page */
router.get('/', indexController.displayHomePage);

router.get('/login', indexController.displayLogin);
//needs a post

router.get('/SLanding', indexController.displaySLanding);

router.get('/instructions', indexController.displayInstruction);

//for listing will do later
router.get('/list',indexController.displayListSurvey);

router.get('/list/:id', indexController.deleteSurvey);

router.get('/TakeSurvey/:id', indexController.displaySurvey);

router.get('/thanks', indexController.processSurvey);


//requires auth
//this is how we add questions
router.get('/survey_question/:name', indexController.displayQuestionEntry);
//the post for the questions
router.post('/survey_question/:name', indexController.processQuestionAdd);

//add the edit question route


//for auth
router.get('/user', indexController.displayUserPage);


//for creating a survey 
//requires auth
router.get('/create', indexController.displayCreateSurvey);
//post to acutally set the survey
router.post('/create', indexController.processNewSurvey);

//router.get('/survey/:id', indexController.displaySurvey);

module.exports = router;
