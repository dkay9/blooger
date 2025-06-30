const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// Public profile view by username
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    }).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update logged-in user's profile
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio, image },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

