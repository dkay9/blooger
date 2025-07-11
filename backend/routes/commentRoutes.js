const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/auth");

// Protect this route with authentication middleware
router.post("/", authMiddleware, commentController.addComment);
router.get("/:postId", commentController.getCommentsByPost);

module.exports = router;
