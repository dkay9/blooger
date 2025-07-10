const Like = require("../models/Like");
const Post = require("../models/Post");

exports.toggleLike = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  try {
    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
      await existingLike.deleteOne();
      await Post.findByIdAndUpdate(postId, { $pull: { likes: existingLike._id } });
      return res.status(200).json({ liked: false });
    }

    const newLike = await Like.create({ postId, userId });
    await Post.findByIdAndUpdate(postId, { $push: { likes: newLike._id } });
    res.status(201).json({ liked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
