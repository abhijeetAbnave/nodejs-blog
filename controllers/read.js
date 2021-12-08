const User = require("../models/user");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const file = require("../controllers/details.json")

function requestVerifier(req, res, next) {
  console.log("Request verifier got called ");
  next();
}


var getRequest = function (req, res) {
  try {   
     console.log(JSON.stringify(file));
    // const data = fs.readFileSync(path.resolve(__dirname, '../controllers/details.json'), "utf8") ;
    res.send(file);
  } catch (e) {
    res.send("Error ", e)
  }
  //console.log(req)
  //res.send("hi")
};

module.exports = {
  validateRequest: requestVerifier,
  getRequest: getRequest,
};
