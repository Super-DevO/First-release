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

router.get('/loggedInHome', indexController.displayLoginHome);

router.get('/register', indexController.displayRegister);

router.post('/register', indexController.processRegister);

router.get('/logout', indexController.performLogout);

router.get('/ylist', indexController.displayYlist);

router.get('/edit/:id', indexController.displayEditPage);

//new for edit
router.get('/deleteQuestion/:id', indexController.deleteQuestion);

router.get('/editQuestion/:id', indexController.editQuestion);

///end of this branch
router.get('/leshawnsPart', indexController.displayLeshawn);

router.get('/slanding/:id', indexController.displaySLanding);

router.get('/instructions', indexController.displayInstruction);


router.get('/list',indexController.displayListSurvey);

//this should not be here it should only be from the ylanding page
router.get('/list/:id', indexController.deleteSurvey);


router.get('/TakeSurvey/:id', indexController.displaySurvey);

//this is the acutal delete I think we should use this
router.get('/delete/:_id', indexController.performDelete);

router.get('/thanks', indexController.processSurvey);


//requires auth
//this is how we add questions
router.get('/survey_question/:name', indexController.displayQuestionEntry);
//the post for the questions
router.post('/survey_question/:name', indexController.processQuestionAdd);

router.get('/survey_question2/:name', indexController.displayQuestionEntry2);
//the post for the questions
router.post('/survey_question2/:name', indexController.processQuestionAdd2);

router.get('/survey_question3/:name', indexController.displayQuestionEntry3);
//the post for the questions
router.post('/survey_question3/:name', indexController.processQuestionAdd3);

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
