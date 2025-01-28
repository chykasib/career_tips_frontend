import { useRouter } from "next/router";
import blogs from "@/data/blogs";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600">{blog.title}</h1>
      <p className="text-gray-600 mt-2">{blog.date}</p>
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-60 object-cover rounded-lg my-4"
      />
      <p className="text-gray-800 mt-4">{blog.content}</p>
    </div>
  );
}
