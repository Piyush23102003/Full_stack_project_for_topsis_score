import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import { readFile } from 'node:fs';
import fs from "fs";
import { upload_file } from "./cloudinary.js";
// import csv from "csv-parser";
import util from "util"
import csv from "csvtojson";
import { json2csv } from "csvjson-json2csv";
import {topsis} from "./function.js"
import { email_send } from "./email.js";
dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url));

const app=express();
const port=3000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname +'/uploads');
  },
  filename: function (req, file, cb) {
    
    cb(null,`${Date.now()}-${file.originalname}`);
  }
})

const upload = multer({ storage: storage })
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('tiny'));



app.get("/",(req,res) => {
  // console.log(req.body);
res.sendFile(__dirname + "/public/index.html");
});




app.post("/submit",upload.single('upload_file'),(req,res)=>{
  const csvFilePath=req.file.path;






  const imp=req.body.impacts.split(',')
  console.log(imp);
  const impactsArray = [];
  for (const impact of imp) {
  if (impact === '+') {
    impactsArray.push(1);
  } else {
    impactsArray.push(-1);
  }}






  const weight=req.body.weights.split(',');
  const weightsArray=[];
  for(const i of weight){
    const val=parseFloat(i);
    weightsArray.push(val);
  }






  

  (async()=>{
    const data=await csv({checkType:true , delimiter:"auto", output:"json"}).fromFile(req.file.path);
    // console.log(data);
    const matrix = [];
    for (const obj of data) {
    const row = Object.values(obj);
    matrix.push(row);
    }
    console.log(matrix)
    const rankings=topsis(matrix,weightsArray,impactsArray);
    for(let i=0;i<data.length;i++){
      data[i].ranking_of_topsis=rankings[i];
    }
    console.log(data);
    
    const csvdata=json2csv(data);
    fs.writeFile('./uploads/answers.csv',csvdata,(err)=>{
      if (err) throw err;
      console.log("ok");
    })
    const path='./uploads/answers.csv';



    
    









    const email=req.body.email;
   
    try {
      const uploadResult = await upload_file(path, req.file.filename);
      const response = await email_send(email, path);
  
      res.render(__dirname + "/views/final.ejs", {
        a: response.message, // Use a more descriptive variable name
        b: uploadResult.secure_url, // Assuming secure_url holds the URL
      });
    } catch (error) {
      console.error("Error during upload or email sending:", error);
      res.status(500).render(__dirname + "/views/final.ejs", {
        a: "An error occurred. Please try again later.",
      });
    }
    

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });

    fs.unlink('./uploads/answers.csv', (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });


  })();

  




 



  
  
});






app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
 
  



  