const mongoose = require("mongoose")
require('dotenv').config()

const DB = process.env.MONGO_URL

mongoose
.connect(DB)
.then(()=>{
  console.log('Database Connected Successfully');
})
.catch((err)=>{
  console.log(`Error connecting to database ${err.message}`);
})