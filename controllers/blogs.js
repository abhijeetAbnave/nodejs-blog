const Blog = require("../models/blogs");
const Roles = require("../models/roles.json")

String.prototype.toTitleCase = function () { return this.valueOf().toLowerCase().replace(this.valueOf()[0], this.valueOf()[0].toUpperCase()); }

function requestVerifier(req, res, next) {
    console.log("Request verifier got called ");
    next();
}

var postRequest = async function (req, res) {
    console.log("post request got called ", req);
    try {
        const { blog_name, blog_subtitle, blog_content, blog_owner_name, blog_owner_id, blog_created_timestamp, blog_read_time, blog_comments, blog_approved } = req.body;
        let blogApproved = blog_approved ? false : false; //blog approved will always be false as admin will allow it
        if (!(blog_name && blog_subtitle && blog_content && blog_owner_id)) {
            res.status(400).send("All input is required");
        }
        // const oldBlog = await Blogs.findOne({ blog_name });
        // if (oldBlog) {
        //     return res.status(409).send("Blog Already Exist. Please retry");
        // }
        const blog = await Blog.create({
            blog_name: blog_name.toTitleCase(),
            blog_subtitle,
            blog_content,
            blog_owner_name,
            blog_owner_id,
            blog_created_timestamp,
            blog_read_time,
            blog_comments,
            blogApproved
        });

        res.status(201).json(blog);
    } catch (err) {
        console.log(err);
    }
};

var getRequest = function (req, res) {
    let blog_owner_id = req.user.user_id;

    if (req.user.role === Roles.admin) {
        Blog.find({}, (err, blogs) => {
            res.send(blogs.reduce((blogsMap, item) => {
                blogsMap[item.id] = item
                return blogsMap
            }, {}))
        })
    } else {
        Blog.find({ blog_owner_id }, (err, blogs) => {
            res.send(blogs.reduce((blogsMap, item) => {
                blogsMap[item.id] = item
                return blogsMap
            }, {}))
        })
    }
};

var getAllRequest = function (req, res) { //get all list of publised blogs

    Blog.find({ blog_approved: true }, (err, blogs) => {
        if (err) {
            res.status(601).send(err);
        } else {

            res.send(blogs.reduce((blogsMap, item) => {
                blogsMap[item.id] = item
                return blogsMap
            }, {}))
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
                res.status(201).json(blog);
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
                res.status(201).json(blog);
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
    const updatedContent = req.body;
    const options = {
        new: true
    }
    Blog.findByIdAndDelete(blogId, options, (err, blog) => {
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
