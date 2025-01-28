import { useEffect, useState } from "react";
import UserLayout from "@/layouts/UserLayout";
import { ToastContainer, toast } from "react-toastify"; // Importing ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const UserDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  // const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const blogsPerPage = 6;

  // Fetch blogs on page load or page change
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/blogs?page=${currentPage}&limit=${blogsPerPage}`
        );
        const data = await response.json();
        setBlogs(data.blogs || []);
        setFilteredBlogs(data.blogs || []);
        setTotalBlogs(data.total || 0);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  // Apply search filter
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.content.toLowerCase().includes(query) ||
          blog.category.toLowerCase().includes(query)
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(blogs);
    }
  }, [searchQuery, blogs]);

  // Handle bookmarking blogs with toast
  // const toggleBookmark = (blogId) => {
  //   setBookmarkedBlogs((prev) => {
  //     const updated = prev.includes(blogId)
  //       ? prev.filter((id) => id !== blogId) // Remove bookmark
  //       : [...prev, blogId]; // Add bookmark

  //     // Toast message for bookmarking
  //     if (updated.includes(blogId)) {
  //       toast.success("Blog bookmarked successfully!");
  //     } else {
  //       toast.info("Blog removed from bookmarks.");
  //     }

  //     return updated;
  //   });
  // };

  // Handle sharing blogs with toast
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
      <div className="container mx-auto p-5">
        <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search blogs by title, content, or category"
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Blog List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="p-4 border rounded shadow-lg bg-white"
            >
              <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
              <p className="text-gray-700 mb-2">
                {blog.content.slice(0, 100)}...
              </p>
              <p className="text-sm text-blue-600">{blog.category}</p>
              <div className="mt-4 flex justify-start space-x-2">
                <button
                  onClick={() => shareBlog(blog._id)}
                  className="btn btn-sm btn-primary"
                >
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`btn btn-sm ${
                currentPage === index + 1 ? "btn-active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </UserLayout>
  );
};

export default UserDashboard;
