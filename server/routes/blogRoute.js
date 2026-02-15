const express = require("express");
const {
  getAllPosts,
  getPostBySlug,
  getCategories,
} = require("../controllers/blogController");

const router = express.Router();

// GET /api/blog/categories
router.route("/categories").get(getCategories);

// GET /api/blog/posts — must be before /posts/:slug
router.route("/posts").get(getAllPosts);

// GET /api/blog/posts/:slug
router.route("/posts/:slug").get(getPostBySlug);

module.exports = router;
