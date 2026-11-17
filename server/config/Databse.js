const mongoose=require("mongoose")
const path=require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") }); 

exports.dbconnect=()=>{
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("Database connection successfully....")
    })
    .catch((error)=>{
        console.log("error during database connection",error);
        console.error(error);
        process.exit(1);
    })
}