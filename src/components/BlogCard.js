import Link from "next/link";

export default function BlogCard({ blog }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h2 className="text-lg font-semibold mt-4">{blog.title}</h2>
      <p className="text-gray-600 mt-2">{blog.excerpt}</p>
      <Link href={`/blog/${blog.slug}`}>
        <a className="text-blue-500 mt-4 inline-block">Read More</a>
      </Link>
    </div>
  );
}
