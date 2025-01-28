const categories = ["All", "Career Tips", "Tools", "Community Stories"];

export default function BlogCategoryList({ onSelect }) {
  return (
    <div className="flex space-x-4 my-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
