import { useState } from "react";

const ToolForm = ({ onSubmit, tool }) => {
  const [title, setTitle] = useState(tool?.title || "");
  const [description, setDescription] = useState(tool?.description || "");
  const [category, setCategory] = useState(tool?.category || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, category });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          required
        ></textarea>
      </div>
      <div>
        <label className="block text-sm">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered w-full"
          required
        >
          <option value="Resume Building">Nothing</option>
          <option value="Resume Building">Resume Building</option>
          <option value="Interview Preparation">Interview Preparation</option>
          <option value="Skill Tracking">Skill Tracking</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </form>
  );
};

export default ToolForm;
