const User = require("../models/user");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

function requestVerifier(req, res, next) {
  console.log("Request verifier got called ");
  next();
}

var postRequest = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      //  const deletedUser = req.body.deleted; // if it's an instance of model
      //or if it's mongoose model comment line above
      const deletedUser = user.deleted;
      if (!deletedUser) {
        const token = jwt.sign(
          { user_id: user._id, email, role: user.role },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        user.token = token;
        res.status(200).json(user);
      } else {
        res.status(205).json({ message: "Please reach out to the Admin, this user no more exists" });
      }
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  validateRequest: requestVerifier,
  postRequest: postRequest,
};
