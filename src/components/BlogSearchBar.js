import { useState } from "react";

export default function BlogSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="my-4">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search blogs..."
        className="w-full p-3 border border-gray-300 rounded-lg"
      />
    </div>
  );
}
