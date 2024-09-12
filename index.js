const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./models/userModel");
const roleModel = require("./models/roleModel");
const auth = require("./middleware/authentication");
const errorHandler = require("./middleware/errorHandler");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/auth")
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("connection err", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function checkdb(cb) {
  try {
    let data = await roleModel.findOne({ role: "admin" });
    if (!data) {
      let role = new roleModel({
        role: "admin",
      });
      let savedData = await role.save();
      if (savedData) {
        let userData = await userModel.findOne({ role: "admin" });
        if (!userData) {
          let salt = await bcrypt.genSalt(10);
          let hash = await bcrypt.hash("123456789", salt);
          let uData = new userModel({
            email: "admin@a.com",
            password: hash,
            role: "admin",
          });
          let dataa = await uData.save();
          cb(null, dataa);
        }
      }
    } else {
      cb(null, "data");
    }
  } catch (error) {
    cb({ message: error.message, statuscode: error.statuscode }, null);
  }
}

checkdb(function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log("function executed", data);
  }
});

app.post("/register", (req, res, next) => {
  try {
    if (
      req.body.email != null &&
      req.body.email != undefined &&
      req.body.email.length < 3
    ) {
      next({ statusCode: 422, message: "enter a valid name" });
    }
    if (
      req.body.password != null &&
      req.body.password != undefined &&
      req.body.password.length < 7
    ) {
      next({
        statusCode: 422,
        message: "password length should not be less than 7",
      });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          next({ message: err.message, statusCode: err.statuscode });
        }
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            next({ message: err.message, statusCode: err.statuscode });
          }
          req.body.password = hash;
          let registerData = userModel({
            email: req.body.email,
            password: req.body.password,
          });
          registerData
            .save()
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              next({ message: err.message, statusCode: err.statuscode });
            });
        });
      });
    }
  } catch (error) {
    next({ message: error.message, statusCode: error.statuscode });
  }
});

app.post("/login", async (req, res, next) => {
  try {
    if (
      req.body.email != null &&
      req.body.email != undefined &&
      req.body.email.length < 3
    ) {
      next({ statusCode: 422, message: "enter a valid name" });
    }
    if (
      req.body.password != null &&
      req.body.password != undefined &&
      req.body.password.length < 7
    ) {
      next({
        statusCode: 422,
        message: "password length should not be less than 7",
      });
    } else {
      let data = await userModel.findOne({ email: req.body.email });
      if (data) {
        let match = await bcrypt.compare(req.body.password, data.password);
        if (match) {
          let token = await jwt.sign({ uid: data._id }, "thisISMYKEY123", {
            expiresIn: "1minutes",
          });
          token = "JWT " + token;
          res.send(token);
        } else {
          next({ message: "wrong email password", statusCode: 401 });
        }
      } else {
        next({ message: "user is not registered", statusCode: 404 });
      }
    }
  } catch (error) {
    next({ message: error.message, statusCode: error.statuscode });
  }
});

app.post("/adddata", auth, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next({ message: error.message, statusCode: error.statuscode });
  }
});

//error Handler Middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log("server run at port 3000");
});
