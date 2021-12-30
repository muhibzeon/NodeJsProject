//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
const encrypt = require("mongoose-encryption");

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encrpytedFields: ["password"], excludeFromEncryption: ["email"]});

const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username, //they are coming from ejs page
    password: req.body.password //Capturing the user input
  });

  newUser.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser.password === password){
        res.render("secrets");
      }else{
        res.send("Wrong Password!");
      }
    }
  });
});


app.listen(3000, function(){
  console.log("Server Started at port 3000");
});
