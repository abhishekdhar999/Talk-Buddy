const mongoose = require("mongoose");
// const colors = require("colors");

const connectDB = async () => {
  try {
    console.log("connecting mongo db")
     await mongoose.connect("mongodb://localhost:27017/talkbuddy",{
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
     });

    console.log(`MongoDB Connected: `);
  } catch (error) {
    console.log("in this")
     console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};



module.exports = connectDB;



// useNewUrlParser: true,
//       useUnifiedTopology: true,
// const mongoose = require('mongoose');
// // mongoose.connect('mongodb://localhost:27017');

// main().catch(err => console.log(err));
// async function main(){
//     await mongoose.connect("mongodb://localhost:27017/nyaysathi")
   
// }