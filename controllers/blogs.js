const Blog = require("../models/blogs");
const User = require("../models/user");
const Roles = require("../models/roles.json")
const moment = require('moment');

String.prototype.toTitleCase = function () { return this.valueOf().toLowerCase().replace(this.valueOf()[0], this.valueOf()[0].toUpperCase()); }

async function requestVerifier(req, res, next) {
    // const userId = req.user.user_id;
    // const user = await User.findOne({ userId } );
    // if(!user.deleted){        
    console.log("Request verifier got called ");
    next();
    // } else {
    //     res.status(205).json({ message: "Please reach out to the Admin, this user no more exists" });
    // }
}

var postRequest = async function (req, res) {
    console.log("post request got called ", req);
    try {
        const { blog_name, blog_subtitle, blog_content, blog_owner_name, blog_owner_id, blog_read_time, blog_comments } = req.body;
        let deleted = false;
        if (!(blog_name && blog_subtitle && blog_content && blog_owner_id)) {
            res.status(400).send("All input is required");
        }
        const blog_created_timestamp = moment().format('YYYY-MM-DDTHH:mm:ss+00:00');
        const titleCaseName = blog_name
        // .toTitleCase();
        const blog = await Blog.create({
            blog_name: titleCaseName,
            blog_subtitle,
            blog_content,
            blog_owner_name,
            blog_owner_id,
            blog_created_timestamp,
            blog_read_time,
            blog_comments,
            blog_approved: false, //blog approved will always be false as admin will allow it
            deleted
        });

        getRequest(req, res);
    } catch (err) {
        console.log(err);
    }
};

var getRequest = function (req, res) {
    let blog_owner_id = req.user.user_id;

    if (req.user.role === Roles.admin) {
        Blog.find({}, (err, blogs) => {
            res.send(Object.values(blogs.reduce((blogsMap, item) => {
                blogsMap[item.id] = item
                return blogsMap
            }, {})))
        })
    } else {
        Blog.find({ blog_owner_id, deleted: false }, (err, blogs) => {  //soft deleted not allowed
            res.send(Object.values(blogs.reduce((blogsMap, item) => {
                blogsMap[item.id] = item
                return blogsMap
            }, {})))
        })
    }
};

var getAllRequest = function (req, res) { //get all list of publised blogs
    let filter = {
        deleted: false,
        blog_approved: true
    }
    Blog.find(filter, (err, blogs) => { //soft deleted not allowed
        if (err) {
            res.status(601).send(err);
        } else {

            res.send(Object.values(blogs.reduce((blogsMap, item) => {
                blogsMap[item.id] = item
                return blogsMap
            }, {})))
        }
    })
};

var putRequest = function (req, res) {
    const blogId = req.body._id;
    const userId = req.user.user_id;
    const userRole = req.user.role;
    const bloggerId = req.body.blog_owner_id
    const updatedContent = req.body;
    updatedContent.blog_approved = false // blog will again go for approval
    const options = {
        new: true
    }
    if ((userRole == Roles.admin) || (bloggerId === userId)) {
        Blog.findByIdAndUpdate(blogId, updatedContent, options, (err, blog) => {
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

var putApproveRequest = function (req, res) {
    const blogId = req.body._id;
    const userRole = req.user.role;
    const updatedContent = req.body;
    const options = {
        new: true
    }
    if (userRole == Roles.admin) {
        Blog.findByIdAndUpdate(blogId, updatedContent, options, (err, blog) => {
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

var deleteRequest = function (req, res) {
    const blogId = req.body._id;
    const updatedContent = {
        _id: req.body._id,
        deleted: true
    };
    const options = {
        new: true
    }
    Blog.findByIdAndUpdate(blogId, updatedContent, options, (err, blog) => { //soft delete
        // Blog.findByIdAndDelete(blogId, options, (err, blog) => { //hard delete
        if (!err) {
            getRequest(req, res);
        } else {
            res.status(601).send(err);
        }
    })
};

module.exports = {
    validateRequest: requestVerifier,
    postRequest: postRequest,
    getRequest: getRequest,
    getAllRequest: getAllRequest,
    putRequest: putRequest,
    putApproveRequest: putApproveRequest,
    deleteRequest: deleteRequest,
};
