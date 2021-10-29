const User = require("../models/user");
const Roles = require("../models/roles.json")


function requestVerifier(req, res, next) {
  console.log("Request verifier got called ");
  next();
}

var getRequest = function (req, res) {
  User.find({}, (err, users) => {
    if(req.user.role === Roles.admin){
      res.send(users.reduce((userMap, item) => {
        userMap[item.id] = item
        return userMap
      }, {}))
    } else {
      res.status(666).send("This user not allowed");
    }
  })
};

module.exports = {
  validateRequest: requestVerifier,
  getRequest: getRequest,
};
