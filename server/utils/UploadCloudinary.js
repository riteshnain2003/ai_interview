const cloudinary = require("cloudinary").v2;
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const fs = require("fs");

exports.uploadtocloudinary=async(file,folder,height,quality)=>{
    try{
        const options={
            folder:folder,
            resource_type:"auto"
        }
        if(height){options.height=height}
        if(quality){options.quality=quality}
       const result= await cloudinary.uploader.upload(file,options);
       if(fs.existsSync(file)){
        fs.unlinkSync(file)
       }
       return result.secure_url
    }catch(error){
         if(fs.existsSync(file)){
        fs.unlinkSync(file)}
        console.log("error during upload to cloudinary")
        console.error(error)
    }

}