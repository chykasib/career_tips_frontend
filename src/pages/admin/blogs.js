import AdminLayout from "@/layouts/AdminLayout";
import { useState, useEffect } from "react";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [categories] = useState([
    "Career Growth",
    "Productivity",
    "Leadership",
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      })
      .then((data) => {
        if (data.blogs && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        } else {
          setBlogs([]);
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddOrUpdateBlog = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", newBlog.title);
      formData.append("content", newBlog.content);
      formData.append("category", newBlog.category);

      const method = editingBlog ? "PUT" : "POST";
      const url = editingBlog
        ? `http://localhost:5000/api/blogs/${editingBlog._id}`
        : "http://localhost:5000/api/blogs";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        setNewBlog({ title: "", content: "", category: "" });
        setEditingBlog(null);
      } else {
        throw new Error("Failed to save blog.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBlog = (blog) => {
    setNewBlog(blog);
    setEditingBlog(blog);
  };

  const confirmDeleteBlog = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDeleteBlog = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/blogs/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog._id !== deleteId)
        );
        setShowModal(false);
        setDeleteId(null);
      } else {
        throw new Error("Failed to delete blog.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        {error && (
          <div className="alert alert-error bg-red-600 text-white">{error}</div>
        )}

        {/* Blog Form */}
        <div className="card shadow-xl p-6 bg-gradient-to-r from-blue-100 to-blue-300 rounded-xl">
          <h2 className="text-3xl font-semibold text-center mb-6">
            {editingBlog ? "Edit Blog" : "Add New Blog"}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input
              type="text"
              placeholder="Blog Title"
              value={newBlog.title}
              onChange={(e) =>
                setNewBlog({ ...newBlog, title: e.target.value })
              }
              className="input input-bordered bg-white text-black hover:bg-blue-50 focus:outline-none"
            />
            <select
              value={newBlog.category}
              onChange={(e) =>
                setNewBlog({ ...newBlog, category: e.target.value })
              }
              className="input input-bordered bg-white text-black hover:bg-blue-50 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Blog Content"
            value={newBlog.content}
            onChange={(e) =>
              setNewBlog({ ...newBlog, content: e.target.value })
            }
            className="textarea textarea-bordered w-full mt-4 bg-white text-black hover:bg-blue-50 focus:outline-none"
            rows="6"
          />
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleAddOrUpdateBlog}
              className={`btn ${
                editingBlog ? "btn-warning" : "btn-primary"
              } w-full sm:w-32 hover:scale-105`}
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : editingBlog
                ? "Update Blog"
                : "Add Blog"}
            </button>
            {editingBlog && (
              <button
                onClick={() => {
                  setNewBlog({
                    title: "",
                    content: "",
                    category: "",
                  });
                  setEditingBlog(null);
                }}
                className="btn btn-secondary w-full sm:w-32 mt-4 sm:mt-0 hover:scale-105"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Blog List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="card shadow-lg p-6 bg-white rounded-lg space-y-4 hover:shadow-xl transition-all"
            >
              <h3 className="text-2xl font-bold text-gray-800 hover:text-indigo-600">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-indigo-600">
                  {blog.category}
                </span>
              </p>
              <p className="text-gray-700 line-clamp-3">{blog.content}</p>
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
                <button
                  onClick={() => handleEditBlog(blog)}
                  className="btn btn-success btn-sm w-full sm:w-auto hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDeleteBlog(blog._id)}
                  className="btn btn-error btn-sm w-full sm:w-auto hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from(
            { length: Math.ceil(blogs.length / blogsPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`btn btn-outline ${
                  currentPage === index + 1 ? "btn-primary" : "btn-secondary"
                } btn-sm hover:scale-105`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-bold">Confirm Deletion</h3>
              <p>Are you sure you want to delete this blog?</p>
              <div className="modal-action flex flex-col sm:flex-row gap-4 sm:gap-2">
                <button
                  onClick={handleDeleteBlog}
                  className="btn btn-error w-full sm:w-32 hover:bg-red-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary w-full sm:w-32 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
