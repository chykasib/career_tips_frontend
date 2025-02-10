import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskManager = () => {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Establish WebSocket connection
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("newNotification", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const addTask = async () => {
    if (!newTask.title.trim()) {
      setError("Task title is required.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        setNewTask({ title: "", description: "" });
        toast.success("Task added successfully!"); // Show success toast
      }
    } catch (err) {
      setError("Failed to add task.");
      toast.error("Failed to add task!"); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Task Manager</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <button
          onClick={addTask}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading tasks...</p>}

      {/* Display Notifications */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Notifications</h3>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className="p-2 bg-yellow-100 rounded mt-2">
              {notification.message}
            </li>
          ))}
        </ul>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default TaskManager;
