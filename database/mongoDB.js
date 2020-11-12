const { exports: exp } = module;
const mongoose = require("mongoose");

const surveysUriDB = "mongodb+srv://admin:admin@books.tgim5.mongodb.net/surveys?retryWrites=true&w=majority";
const questionsUriDB = "mongodb+srv://admin:admin@books.tgim5.mongodb.net/questions?retryWrites=true&w=majority";

//export mongoose
exp.mongoose = mongoose;

//create & export a connection with the surveys database
exp.surveysDBConnection = mongoose.connect(surveysUriDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//create & export a connection with the questions database
exp.questionsDBConnection = mongoose.connect(questionsUriDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//create the schema for a survey
const Survey = new mongoose.Schema({
  available: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: new Date()
  },
  update: {
    type: Date,
    default: new Date()
  },
  salt: String,
  __v: Number
},
{
  collection: "surveys"
});

//create the schema for questions
const Question = new mongoose.Schema({
  survey: {
    type: String,
    required: true 
  },
  question: {
    type: String,
    required: true
  },
  salt: String,
  __v: Number
},
{
  collection: "questions"
});

//set & export the schema for the surveys
exp.schemaSurvey = mongoose.model("Survey", Survey);

//set & export the schema fro the questions
exp.schemaQuestion = mongoose.model("Question", Question);