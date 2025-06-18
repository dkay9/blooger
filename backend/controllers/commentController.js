const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.addComment = async (req, res) => {
  const { postId, userId, text } = req.body;

  try {
    const comment = await Comment.create({ postId, userId, text });
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
