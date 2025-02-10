import { useEffect, useState } from "react";
import UserLayout from "@/layouts/UserLayout";
import { ToastContainer, toast } from "react-toastify";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";
import {
  FiSearch,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const UserBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/blogs?page=${currentPage}&limit=${blogsPerPage}`
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch blogs");

        setBlogs(data.blogs || []);
        setFilteredBlogs(data.blogs || []);
        setTotalBlogs(data.total || 0);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        toast.error(err.message || "Failed to load blogs");
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const toggleBookmark = async (blogId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/blogs/bookmark/${blogId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to toggle bookmark");
      }

      const updatedBlog = await response.json();

      // Update state to reflect bookmark changes
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId
            ? { ...blog, isBookmarked: updatedBlog.isBookmarked }
            : blog
        )
      );

      setFilteredBlogs((prevFiltered) =>
        prevFiltered.map((blog) =>
          blog._id === blogId
            ? { ...blog, isBookmarked: updatedBlog.isBookmarked }
            : blog
        )
      );

      toast.success(
        updatedBlog.isBookmarked
          ? "Blog added to bookmarks!"
          : "Blog removed from bookmarks!"
      );
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      toast.error(err.message || "Failed to update bookmark");
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = blogs.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(query) ||
          blog.content?.toLowerCase().includes(query) ||
          blog.category?.toLowerCase().includes(query)
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(blogs);
    }
  }, [searchQuery, blogs]);

  const shareBlog = (blogId) => {
    const blog = blogs.find((b) => b._id === blogId);
    if (blog) {
      const blogUrl = `${window.location.origin}/blogs/${blogId}`;
      navigator.clipboard.writeText(blogUrl);
      toast.success(`Link to "${blog.title}" copied to clipboard!`);
    }
  };

  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Explore Blogs
          </h1>

          {/* Search Bar */}
          <div className="mb-10 relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, content, or category"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Blog List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
              >
                <div className="p-6">
                  {/* Category and Bookmark Header */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
                      {blog.category}
                    </span>
                    <button
                      onClick={() => toggleBookmark(blog._id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {blog.isBookmarked ? (
                        <BsBookmarkFill className="h-5 w-5 text-blue-600" />
                      ) : (
                        <BsBookmark className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.content}
                  </p>

                  {/* Share Button */}
                  <button
                    onClick={() => shareBlog(blog._id)}
                    className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FiShare2 className="h-4 w-4" />
                    <span>Share Article</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </UserLayout>
  );
};

export default UserBlog;
