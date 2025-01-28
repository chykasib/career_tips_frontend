import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { fetchTools } from "../../utils/api";

const AdminTools = () => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const loadTools = async () => {
      const data = await fetchTools();
      setTools(data);
    };
    loadTools();
  }, []);

  const categorizedTools = tools.reduce((categories, tool) => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
    return categories;
  }, {});

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Career Tools</h1>
      {Object.entries(categorizedTools).map(([category, tools]) => (
        <div key={category} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{category}</h2>
          <ul className="space-y-2">
            {tools.map((tool) => (
              <li
                key={tool._id}
                className="p-4 bg-gray-100 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{tool.title}</h3>
                  <p>{tool.description}</p>
                </div>
                <button className="btn btn-danger">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </AdminLayout>
  );
};

export default AdminTools;
