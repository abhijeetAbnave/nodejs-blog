var express = require('express');
const cors = require('cors');
const port = process.env.PORT || 8080;
require("dotenv").config();
require("./dbconnection/dbConnectionCheck").connect();
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors());
app.options('*', cors());
const auth = require("./middleware/auth");

var path = require('path');

// var controllerCall = require(path.resolve('.', 'controllers/makeCall.js'));
var controllerUser = require(path.resolve('.', 'controllers/register.js'));
var controllerGetUsers = require(path.resolve('.', 'controllers/getUsers.js'));
var controllerAuthenticateUser = require(path.resolve('.', 'controllers/login.js'));
var controllerBlogs = require(path.resolve('.', 'controllers/blogs.js'));

// app.post('/summary', controllerCall.validateRequest, controllerCall.postRequest);
app.post('/register', controllerUser.validateRequest, controllerUser.postRequest);
app.post('/login', controllerAuthenticateUser.validateRequest, controllerAuthenticateUser.postRequest);
app.get('/get-users', auth, controllerGetUsers.getRequest);
app.post('/post-blogs', auth, controllerBlogs.postRequest);
app.get('/get-blogs', auth, controllerBlogs.getRequest);
app.get('/get-all-blogs', auth, controllerBlogs.getAllRequest);
app.put('/put-blogs', auth, controllerBlogs.putRequest);
app.put('/approve-blog', auth, controllerBlogs.putApproveRequest);
app.delete('/delete-blogs', auth, controllerBlogs.deleteRequest);


app.listen(port, function () {
    console.log("API server started on: ", port);
});


