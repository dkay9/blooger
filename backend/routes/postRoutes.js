const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/auth");

// Create post (requires login)
router.post("/", authMiddleware, postController.createPost);

// Get all posts (public)
router.get("/", postController.getAllPosts);

// ✅ NEW: Get logged-in user's posts
router.get("/user/posts", authMiddleware, postController.getUserPosts); 

// Get single post by slug (public)
router.get("/:slug", postController.getPostBySlug);


module.exports = router;
