const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema({
  blog_name: { type: String, default: null },
  blog_subtitle: { type: String, default: null },
  blog_content: { type: String, default: null },
  blog_owner_name: { type: String },
  blog_owner_id: { type: String },
  blog_created_timestamp: { type: String },
  blog_read_time: {type: String},
  blog_comments: {type: String},
  blog_approved: {type: Boolean}
});

module.exports = mongoose.model("blog", blogsSchema);