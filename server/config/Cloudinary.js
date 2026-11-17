const cloudinary = require("cloudinary").v2;
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

exports.cloudinaryconnect=()=>{
    try{
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET,
            timeout:120000
            
        })
        console.log("cloudinary connected sucessfully")

    }catch(error){
        console.log("error during connecting with cloudinary",error)
    }

}