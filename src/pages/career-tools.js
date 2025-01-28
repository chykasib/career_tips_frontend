import { motion } from "framer-motion";

export default function CareerTools() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold text-blue-600"
      >
        Career Tools
      </motion.h1>

      {/* Tools List */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
      >
        {[
          "Resume Builder",
          "Cover Letter Templates",
          "Job Application Tracker",
        ].map((tool, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-md rounded-lg"
          >
            <h2 className="text-xl font-bold text-gray-800">{tool}</h2>
            <p className="mt-2 text-gray-600">
              Click to use the {tool.toLowerCase()} tool.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Use Now
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
