// pages/dashboard.js
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [tools, setTools] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch(`/api/tools?category=${filter}`)
      .then((res) => res.json())
      .then((data) => setTools(data))
      .catch((err) => console.error("Error fetching tools:", err));
  }, [filter]);

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Career Tools Dashboard</h1>
      <select
        className="input input-bordered mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Resume Building">Resume Building</option>
        <option value="Interview Preparation">Interview Preparation</option>
        <option value="Skill Tracking">Skill Tracking</option>
      </select>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div key={tool._id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-bold">{tool.title}</h2>
            <p>{tool.description}</p>
            <p className="text-gray-500">Category: {tool.category}</p>
            <div className="text-sm text-green-600">
              Progress: {tool.userProgress?.completedSteps || 0}/
              {tool.userProgress?.totalSteps}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
