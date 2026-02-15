const path = require("path");
const blogData = require(path.join(__dirname, "../data/blogPosts.json"));

// GET /api/blog/posts
// Supports query params: search, category, limit
const getAllPosts = (req, res) => {
  try {
    let result = [...blogData.posts];

    const { search, category, limit } = req.query;

    // Filter by category
    if (category && category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Filter by search term (title + excerpt)
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.excerpt.toLowerCase().includes(term)
      );
    }

    // Limit results
    if (limit) {
      result = result.slice(0, parseInt(limit));
    }

    res.status(200).json({
      success: true,
      count: result.length,
      posts: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/blog/posts/:slug
const getPostBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const post = blogData.posts.find((p) => p.slug === slug);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Blog post not found" });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/blog/categories
const getCategories = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      categories: blogData.categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllPosts,
  getPostBySlug,
  getCategories,
};
