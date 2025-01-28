export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600">Blog</h1>

      {/* Search Bar */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search blogs..."
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {/* Blog List */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          "How to Ace Your Next Job Interview",
          "Top 10 In-demand Skills for 2025",
        ].map((blog, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold">{blog}</h2>
            <p className="mt-2 text-gray-600">
              A quick overview of tips and tricks to improve your chances...
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
