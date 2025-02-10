import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ToolForm from "../../components/ToolForm";
import {
  createTool,
  deleteTool,
  fetchToolById,
  fetchTools,
  updateTool,
} from "@/utils/api";
import Spinner from "@/components/ui/spinner";

const ManageTools = () => {
  const [tools, setTools] = useState([]);
  const [currentTool, setCurrentTool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTools = async () => {
      setLoading(true); // Set loading to true before fetching
      const data = await fetchTools();
      setTools(data);
      setLoading(false); // Set loading to false after data is fetched
    };
    getTools();
  }, []);

  const handleAddTool = async (toolData) => {
    const newTool = await createTool(toolData);
    setTools([...tools, newTool]);
    setIsModalOpen(false);
  };

  const handleEditTool = async (id) => {
    const tool = await fetchToolById(id);
    setCurrentTool(tool);
    setIsModalOpen(true);
  };

  const handleUpdateTool = async (toolData) => {
    const updatedTool = await updateTool(currentTool._id, toolData);
    setTools(
      tools.map((tool) => (tool._id === currentTool._id ? updatedTool : tool))
    );
    setCurrentTool(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteTool(id);
    setTools(tools.filter((tool) => tool._id !== id));
  };

  const openAddModal = () => {
    setCurrentTool(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentTool(null);
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="px-6 py-4 bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Manage Career Tools
        </h1>
        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          + Add New Tool
        </button>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center mt-6">
            <Spinner />
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md animate__animated animate__fadeIn">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {currentTool ? "Edit Tool" : "Add New Tool"}
              </h2>
              <ToolForm
                onSubmit={currentTool ? handleUpdateTool : handleAddTool}
                tool={currentTool}
                categories={[
                  "Resume Building",
                  "Interview Preparation",
                  "Skill Tracking",
                ]}
              />
              <div className="flex justify-between mt-6">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {tools.map((tool) => (
            <li
              key={tool._id}
              className="p-6 bg-white border rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {tool.title}
              </h2>
              <p className="text-gray-700 mt-3">{tool.description}</p>
              <p className="text-sm text-blue-600 mt-2">{tool.category}</p>
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                <button
                  onClick={() => handleEditTool(tool._id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition w-full sm:w-auto"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tool._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
};

export default ManageTools;
