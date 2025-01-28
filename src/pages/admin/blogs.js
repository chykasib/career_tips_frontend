import { useState, useEffect } from "react";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    category: "",
    image: null,
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [error, setError] = useState(null);
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
      .catch((error) => setError(error.message));
  }, []);

  const handleAddOrUpdateBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newBlog.title);
      formData.append("content", newBlog.content);
      formData.append("category", newBlog.category);
      if (newBlog.image) formData.append("image", newBlog.image);

      const method = editingBlog ? "PUT" : "POST";
      const url = editingBlog
        ? `http://localhost:5000/api/blogs/${editingBlog._id}`
        : "http://localhost:5000/api/blogs";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        setNewBlog({ title: "", content: "", category: "", image: null });
        setEditingBlog(null);
      } else {
        throw new Error("Failed to save blog.");
      }
    } catch (err) {
      setError(err.message);
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
    }
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {error && <div className="alert alert-error">{error}</div>}

      {/* Blog Form */}
      <div className="card shadow-lg p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          {editingBlog ? "Edit Blog" : "Add New Blog"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Blog Title"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            className="input input-bordered"
          />
          <select
            value={newBlog.category}
            onChange={(e) =>
              setNewBlog({ ...newBlog, category: e.target.value })
            }
            className="input input-bordered"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) =>
              setNewBlog({ ...newBlog, image: e.target.files[0] })
            }
            className="file-input"
          />
        </div>
        <textarea
          placeholder="Blog Content"
          value={newBlog.content}
          onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
          className="textarea textarea-bordered w-full mt-4"
        />
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleAddOrUpdateBlog}
            className={`btn ${editingBlog ? "btn-warning" : "btn-primary"}`}
          >
            {editingBlog ? "Update Blog" : "Add Blog"}
          </button>
          {editingBlog && (
            <button
              onClick={() => {
                setNewBlog({
                  title: "",
                  content: "",
                  category: "",
                  image: null,
                });
                setEditingBlog(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBlogs.map((blog) => (
          <div
            key={blog._id}
            className="card shadow-md p-4 rounded-lg bg-gray-50 space-y-2"
          >
            {/* {blog.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`http://localhost:5000${blog.image || "/placeholder.jpg"}`}
                alt={blog.title}
                className="w-full h-32 object-cover rounded"
              />
            )} */}
            <h3 className="text-xl font-bold">{blog.title}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{blog.category}</span>
            </p>
            <p className="text-gray-700 line-clamp-3">{blog.content}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEditBlog(blog)}
                className="btn btn-success btn-sm"
              >
                Edit
              </button>
              <button
                onClick={() => confirmDeleteBlog(blog._id)}
                className="btn btn-error btn-sm"
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
              className={`btn ${
                currentPage === index + 1 ? "btn-primary" : "btn-outline"
              } btn-sm`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p>Are you sure you want to delete this blog?</p>
            <div className="modal-action">
              <button onClick={handleDeleteBlog} className="btn btn-error">
                Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
