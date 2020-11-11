const { schemaDB } = require("./mongoDB");

//delete all the documents from the database (for testing)
schemaDB.remove({})
  .exec()
  .then(data => {
    if(process.env.NODE_ENV !== "production") {
      console.log(data);
    }
  })
  .catch(console.error)