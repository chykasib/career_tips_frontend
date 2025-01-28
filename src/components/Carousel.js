import { motion } from "framer-motion";

const items = [
  { title: "Career Growth Tools", description: "Build your future today." },
  { title: "Personalized Dashboard", description: "Track your progress." },
  { title: "Expert Blogs", description: "Stay updated with the latest tips." },
];

export default function Carousel() {
  return (
    <div className="overflow-hidden relative w-full max-w-4xl mx-auto">
      <motion.div
        className="flex"
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 8,
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full p-6 bg-blue-100 m-2 rounded-lg"
          >
            <h2 className="text-xl font-bold text-blue-600">{item.title}</h2>
            <p className="mt-2 text-gray-700">{item.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
