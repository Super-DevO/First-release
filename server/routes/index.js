let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');

function requireAuth(req, res, next)
{
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}

/* GET Landing page */
router.get('/', indexController.displayHomePage);

router.get('/login', indexController.displayLogin);

router.post('/login', indexController.processLoginPage);

router.get('/loggedInHome', requireAuth, indexController.displayLoginHome);

router.get('/register', indexController.displayRegister);

router.post('/register', indexController.processRegister);

router.get('/logout', requireAuth, indexController.performLogout);

router.get('/ylist', requireAuth, indexController.displayYlist);

router.get('/edit/:id', requireAuth, indexController.displayEditPage);

router.get('/edit2/:id', requireAuth, indexController.displayEditPage);

router.get('/edit3/:id', requireAuth, indexController.displayEditPage);

//router.post('/edit/:id', indexController.editQuestion);

//new for edit.ejs
router.get('/deleteQuestion/:id', requireAuth, indexController.deleteQuestion);

//router.get('/editQuestion/:id', indexController.editQuestion);

//router.post('/editQuestion/:id', indexController.editQuestion);

router.get('/alterStatement/:id', requireAuth, indexController.displayEditQuestionEntry);

router.post('/alterStatement/:id', requireAuth, indexController.processNewStatement);

router.get('/alterMC/:id', requireAuth, indexController.displayAlterMC);

router.post('/alterMC/:id', requireAuth, indexController.processAlterMC)
///end of this branch
router.get('/leshawnsPart', indexController.displayLeshawn);

//where we get answers
router.get('/slanding/:id', indexController.displaySLanding);

router.post('/slanding/:id', indexController.processSurveyQuestion);

router.get('/thanks', indexController.displayThanks);

//bs pages
router.get('/instructions', indexController.displayInstruction);

//un-authroized list
router.get('/list', indexController.displayListSurvey);

//this should not be here it should only be from the ylanding page
router.get('/list/:id', indexController.deleteSurvey);


router.get('/TakeSurvey/:id', indexController.displaySurvey);

//to delete each survey in user
router.get('/delete/:_id', requireAuth, indexController.performDelete);

router.get('/results1/:id', requireAuth, indexController.displayResults1);

router.get('/arbitrayRoute', indexController.testSeqtest);

//requires auth
//this is how we add questions
router.get('/survey_question/:name', requireAuth, indexController.displayQuestionEntry);
//the post for the questions
router.post('/survey_question/:name', requireAuth, indexController.processQuestionAdd);

router.get('/survey_question2/:name', requireAuth, indexController.displayQuestionEntry2);
//the post for the questions
router.post('/survey_question2/:name', requireAuth, indexController.processQuestionAdd2);

router.get('/survey_question3/:name', requireAuth, indexController.displayQuestionEntry3);
//the post for the questions
router.post('/survey_question3/:name', requireAuth, indexController.processQuestionAdd3);

//add the edit question route


//for auth
router.get('/user', indexController.displayUserPage);


//for creating a survey 
//requires auth
router.get('/create', requireAuth, indexController.displayCreateSurvey);
//post to acutally set the survey
router.post('/create', requireAuth, indexController.processNewSurvey);

//router.get('/survey/:id', indexController.displaySurvey);

module.exports = router;
