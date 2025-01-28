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

const ManageTools = () => {
  const [tools, setTools] = useState([]);
  const [currentTool, setCurrentTool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getTools = async () => {
      const data = await fetchTools();
      setTools(data);
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
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Manage Career Tools
        </h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add New Tool
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
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
              <button
                onClick={closeModal}
                className="mt-4 text-red-500 hover:text-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {tools.map((tool) => (
            <li
              key={tool._id}
              className="p-4 bg-white border rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {tool.title}
              </h2>
              <p className="text-gray-600 mt-2">{tool.description}</p>
              <p className="text-sm text-blue-600 mt-1">{tool.category}</p>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => handleEditTool(tool._id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tool._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
