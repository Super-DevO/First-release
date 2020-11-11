const { schemaDB } = require("./mongoDB");

//create all the documents in the db (for testing)
for(let i = 0; i < 100; i++) {
  schemaDB.create({
    active: Math.floor(Math.random() * 10) % 2,
    available: Math.floor(Math.random() * 10) % 2
  })
    .exec()
    .then(data => {
      if(process.env.NODE_ENV !== "production") {
        console.log(data);
      }
    })
    .catch(console.error)
}