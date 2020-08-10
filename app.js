//jshint esversion:6

require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });
      newUser.save(function (err) {
        if (!err) {
          res.render("secrets");
        } else {
          console.log(err);
        }
      });
    });
  });

app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(function (req, res) {
    User.findOne({ email: req.body.username }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          bcrypt.compare(req.body.password, foundUser.password, function (
            err,
            result
          ) {
            if (result === true) {
              res.render("secrets");
            }
          });
        }
      }
    });
  });

app.get("");
app.listen(3000, function (req, res) {
  console.log("App listening to port 3000");
});
