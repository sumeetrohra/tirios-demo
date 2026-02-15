import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiClock,
  FiUser,
  FiCalendar,
  FiShare2,
  FiArrowLeft,
  FiTag,
} from "react-icons/fi";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import API from "../api/axios";

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/blog/posts/${slug}`);
        setPost(res.data?.post || null);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-r-transparent" />
          <p className="mt-4 text-secondary-600 dark:text-secondary-300">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">
            {error || "Blog post not found"}
          </p>
          <Link to="/blog" className="btn mt-4 inline-block">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl text-white"
            >
              <Link
                to="/blog"
                className="inline-flex items-center text-white mb-6 hover:text-primary-300"
              >
                <FiArrowLeft className="mr-2" />
                Back to Blog
              </Link>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center text-secondary-200 dark:text-secondary-300 space-x-6">
                <div className="flex items-center">
                  <FiUser className="mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-2" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  {post.readTime}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-6">
              {/* Share */}
              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FiShare2 className="mr-2" />
                  Share this article
                </h3>
                <div className="flex space-x-4">
                  <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800">
                    <FaFacebook size={20} />
                  </button>
                  <button className="p-2 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-500 hover:bg-sky-200 dark:hover:bg-sky-800">
                    <FaTwitter size={20} />
                  </button>
                  <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800">
                    <FaLinkedin size={20} />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FiTag className="mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
