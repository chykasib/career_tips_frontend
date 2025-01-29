import { useState } from "react";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"; // Import necessary parts from @react-pdf/renderer

// Template formats
const templates = [
  {
    name: "Modern",
    layout: "flex flex-col",
    style: "bg-white text-gray-900 p-6",
    header: "text-4xl font-bold mb-4",
    sectionTitle: "text-xl font-semibold mt-4",
    content: "text-base",
  },
  {
    name: "Professional",
    layout: "flex flex-col",
    style: "bg-blue-50 text-gray-800 p-6",
    header: "text-3xl font-bold mb-4",
    sectionTitle: "text-lg font-semibold mt-4",
    content: "text-base",
  },
  {
    name: "Minimalist",
    layout: "flex flex-col",
    style: "bg-gray-50 text-black p-6",
    header: "text-3xl font-semibold mb-4",
    sectionTitle: "text-lg font-medium mt-4",
    content: "text-base",
  },
  {
    name: "Creative",
    layout: "flex flex-col",
    style: "bg-yellow-100 text-black p-6",
    header: "text-4xl font-extrabold mb-4",
    sectionTitle: "text-xl font-medium mt-4",
    content: "text-base",
  },
  {
    name: "Elegant",
    layout: "flex flex-col",
    style: "bg-pink-50 text-gray-900 p-6",
    header: "text-3xl font-bold mb-4",
    sectionTitle: "text-lg font-semibold mt-4",
    content: "text-base",
  },
  {
    name: "Classic",
    layout: "flex flex-col",
    style: "bg-gray-100 text-black p-6",
    header: "text-3xl font-bold mb-4",
    sectionTitle: "text-lg font-medium mt-4",
    content: "text-base",
  },
  {
    name: "Business",
    layout: "flex flex-col",
    style: "bg-indigo-50 text-gray-900 p-6",
    header: "text-4xl font-extrabold mb-4",
    sectionTitle: "text-xl font-medium mt-4",
    content: "text-base",
  },
  {
    name: "Tech",
    layout: "flex flex-col",
    style: "bg-gray-900 text-white p-6",
    header: "text-4xl font-extrabold mb-4",
    sectionTitle: "text-xl font-medium mt-4",
    content: "text-base",
  },
];

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    linkedin: "",
    github: "",
    twitter: "",
  });
  const [isPreviewed, setIsPreviewed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create the PDF component
  const ResumePDF = () => {
    const styles = StyleSheet.create({
      page: {
        padding: 30,
      },
      header: {
        fontSize: 30,
        textAlign: "center",
        marginBottom: 20,
      },
      sectionTitle: {
        fontSize: 20,
        marginTop: 10,
        fontWeight: "bold",
      },
      content: {
        fontSize: 12,
        marginBottom: 5,
      },
    });

    return (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.header}>{formData.name}</Text>
          <View>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.content}>{formData.contact}</Text>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.content}>{formData.summary}</Text>
            <Text style={styles.sectionTitle}>Experience</Text>
            <Text style={styles.content}>{formData.experience}</Text>
            <Text style={styles.sectionTitle}>Education</Text>
            <Text style={styles.content}>{formData.education}</Text>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.content}>{formData.skills}</Text>
            <Text style={styles.sectionTitle}>Social Media</Text>
            {formData.linkedin && (
              <Text style={styles.content}>LinkedIn: {formData.linkedin}</Text>
            )}
            {formData.github && (
              <Text style={styles.content}>GitHub: {formData.github}</Text>
            )}
            {formData.twitter && (
              <Text style={styles.content}>Twitter: {formData.twitter}</Text>
            )}
          </View>
        </Page>
      </Document>
    );
  };

  const handlePreview = () => {
    setIsPreviewed(true);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
    setIsPreviewed(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-600">
        Resume Builder
      </h1>

      {!selectedTemplate ? (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {templates.map((template, index) => (
            <motion.div
              key={index}
              className="p-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer text-center"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedTemplate(template)}
            >
              <h3 className="text-xl font-bold text-gray-800">
                {template.name}
              </h3>
              <p className="mt-2 text-gray-600">Click to choose</p>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <button
              className="btn bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              onClick={handleBack}
            >
              Back
            </button>
            <h2 className="text-3xl font-bold text-gray-900">
              Editing: {selectedTemplate.name}
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="input input-bordered w-full py-2 px-4 rounded-md border border-gray-300"
              onChange={handleChange}
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact Information"
              className="input input-bordered w-full py-2 px-4 rounded-md border border-gray-300"
              onChange={handleChange}
            />
            <textarea
              name="summary"
              placeholder="Professional Summary"
              className="textarea textarea-bordered w-full py-2 px-4 rounded-md border border-gray-300"
              onChange={handleChange}
            ></textarea>
            <textarea
              name="experience"
              placeholder="Work Experience"
              className="textarea textarea-bordered w-full py-2 px-4 rounded-md border border-gray-300"
              onChange={handleChange}
            ></textarea>
            <textarea
              name="education"
              placeholder="Education"
              className="textarea textarea-bordered w-full py-2 px-4 rounded-md border border-gray-300"
              onChange={handleChange}
            ></textarea>
            <textarea
              name="skills"
              placeholder="Skills"
              className="textarea textarea-bordered w-full py-2 px-4 rounded-md border border-gray-300"
              onChange={handleChange}
            ></textarea>

            {/* Social Media Links */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Social Media Links</h3>
              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn URL"
                className="input input-bordered w-full py-2 px-4 rounded-md border border-gray-300"
                onChange={handleChange}
              />
              <input
                type="text"
                name="github"
                placeholder="GitHub URL"
                className="input input-bordered w-full py-2 px-4 rounded-md border border-gray-300 mt-2"
                onChange={handleChange}
              />
              <input
                type="text"
                name="twitter"
                placeholder="Twitter URL"
                className="input input-bordered w-full py-2 px-4 rounded-md border border-gray-300 mt-2"
                onChange={handleChange}
              />
            </div>

            <button
              className="btn bg-indigo-600 text-white w-full py-2 mt-4 rounded-md hover:bg-indigo-700"
              onClick={handlePreview}
            >
              Preview Resume
            </button>
          </div>

          {/* Preview Section */}
          {isPreviewed && (
            <div className={`mt-6 ${selectedTemplate.style}`}>
              <h3 className={`${selectedTemplate.header} text-center`}>
                {formData.name}
              </h3>
              <div className={`${selectedTemplate.layout}`}>
                <div className="p-4">
                  <h4 className={`${selectedTemplate.sectionTitle}`}>
                    Contact
                  </h4>
                  <p className={`${selectedTemplate.content}`}>
                    {formData.contact}
                  </p>
                  <h4 className={`${selectedTemplate.sectionTitle}`}>
                    Summary
                  </h4>
                  <p className={`${selectedTemplate.content}`}>
                    {formData.summary}
                  </p>
                  <h4 className={`${selectedTemplate.sectionTitle}`}>
                    Experience
                  </h4>
                  <p className={`${selectedTemplate.content}`}>
                    {formData.experience}
                  </p>
                  <h4 className={`${selectedTemplate.sectionTitle}`}>
                    Education
                  </h4>
                  <p className={`${selectedTemplate.content}`}>
                    {formData.education}
                  </p>
                  <h4 className={`${selectedTemplate.sectionTitle}`}>Skills</h4>
                  <p className={`${selectedTemplate.content}`}>
                    {formData.skills}
                  </p>

                  {/* Social Media Links */}
                  <h4 className={`${selectedTemplate.sectionTitle}`}>
                    Social Media
                  </h4>
                  {formData.linkedin && (
                    <p className={`${selectedTemplate.content}`}>
                      LinkedIn: {formData.linkedin}
                    </p>
                  )}
                  {formData.github && (
                    <p className={`${selectedTemplate.content}`}>
                      GitHub: {formData.github}
                    </p>
                  )}
                  {formData.twitter && (
                    <p className={`${selectedTemplate.content}`}>
                      Twitter: {formData.twitter}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <PDFDownloadLink
                  document={<ResumePDF />}
                  fileName={`${formData.name}_resume.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <button className="btn bg-indigo-600 text-white py-2 px-4 rounded-md">
                        Loading PDF...
                      </button>
                    ) : (
                      <button className="btn bg-indigo-600 text-white py-2 px-4 rounded-md">
                        Download Resume (PDF)
                      </button>
                    )
                  }
                </PDFDownloadLink>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeBuilder;
