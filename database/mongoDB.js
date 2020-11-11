const { exports: exp } = module;
const mongoose = require("mongoose");

const uriDB = "mongodb+srv://admin:admin@books.tgim5.mongodb.net/surveys?retryWrites=true&w=majority";

//export mongoose
exp.mongoose = mongoose;

//create & export a connection with the database
exp.dbConnection = mongoose.connect(uriDB, {
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

//set & export the schema
exp.schemaDB = mongoose.model("Survey", Survey);