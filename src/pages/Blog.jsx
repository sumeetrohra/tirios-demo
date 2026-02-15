import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiClock, FiUser } from "react-icons/fi";
import API from "../api/axios";

function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/blog/categories");
        setCategories(res.data?.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch posts when filters change
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      const res = await API.get(`/blog/posts?${params.toString()}`);
      setPosts(res.data?.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 py-16">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Real Estate & Crypto Insights
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Stay updated with the latest trends in real estate investment,
            cryptocurrency, and blockchain technology.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  className="input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-r-transparent" />
            <p className="mt-4 text-secondary-600 dark:text-secondary-300">
              Loading posts...
            </p>
          </div>
        )}
        {error && <div className="text-center py-12 text-red-600">{error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12 text-secondary-600 dark:text-secondary-300">
            No articles found matching your search.
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white dark:bg-secondary-800 px-3 py-1 rounded-full text-sm font-medium text-primary-600">
                      {categories.find((c) => c.id === post.category)?.name ||
                        post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-3 hover:text-primary-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-secondary-500 dark:text-secondary-400">
                      <FiUser className="mr-2" />
                      <span className="mr-4">{post.author}</span>
                      <FiClock className="mr-2" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;
