const User = require("../models/user");
const Roles = require("../models/roles.json")


function requestVerifier(req, res, next) {
  console.log("Request verifier got called ");
  next();
}

var getRequest = function (req, res) {
  User.find({}, (err, users) => {
    if (req.user.role === Roles.admin) {
      res.send(Object.values(users.reduce((userMap, item) => {
        userMap[item.id] = item
        return userMap
      }, {})))
    } else {
      res.status(666).send("This user not allowed");
    }
  })
};

var deleteRequest = function (req, res) {
  const userId = req.user.user_id;
  const userRole = req.user.role;
  const updatedContent = req.body;
  updatedContent.deleted = true // user soft delete flag
  const options = {
    new: true
  }
  if (userRole == Roles.admin) {
    User.findByIdAndUpdate(updatedContent._id, updatedContent, options, (err, blog) => {
      if (!err) {
        getRequest(req, res);
      } else {
        res.status(601).send(err);
      }
    })
  } else {
    res.status(666).send("This user not allowed");
  }
};

module.exports = {
  validateRequest: requestVerifier,
  getRequest: getRequest,
  deleteRequest: deleteRequest,
};
