import BlogCard from "@/components/BlogCard";
import BlogSearchBar from "@/components/BlogSearchBar";
import BlogCategoryList from "@/components/BlogCategoryList";
import { useState } from "react";
import blogs from "@/data/blogs";

export default function Blog() {
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  const handleSearch = (query) => {
    const result = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBlogs(result);
  };

  const handleCategorySelect = (category) => {
    if (category === "All") {
      setFilteredBlogs(blogs);
    } else {
      const result = blogs.filter((blog) => blog.category === category);
      setFilteredBlogs(result);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600">Our Blog</h1>
      <p className="text-gray-600 mt-2">
        Explore expert career tips, tools, and stories.
      </p>
      <BlogSearchBar onSearch={handleSearch} />
      <BlogCategoryList onSelect={handleCategorySelect} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
