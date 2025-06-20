const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:slug", postController.getPostBySlug);

module.exports = router;
