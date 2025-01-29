import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
    template: "basic",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const downloadPDF = () => {
    const resumeElement = document.getElementById("resume-preview");
    html2canvas(resumeElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("resume.pdf");
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Resume Builder</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resume Form */}
        <div className="p-4 border rounded shadow-lg">
          <h2 className="text-xl font-bold mb-2">Enter Your Details</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input input-bordered w-full mb-2"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full mb-2"
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="input input-bordered w-full mb-2"
            onChange={handleChange}
          />
          <textarea
            name="education"
            placeholder="Education"
            className="textarea textarea-bordered w-full mb-2"
            onChange={handleChange}
          ></textarea>
          <textarea
            name="experience"
            placeholder="Experience"
            className="textarea textarea-bordered w-full mb-2"
            onChange={handleChange}
          ></textarea>
          <textarea
            name="skills"
            placeholder="Skills"
            className="textarea textarea-bordered w-full mb-2"
            onChange={handleChange}
          ></textarea>
          <button className="btn btn-primary w-full" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>

        {/* Resume Preview */}
        <div
          id="resume-preview"
          className="p-4 border rounded shadow-lg bg-white"
        >
          <h2 className="text-xl font-bold">{formData.name || "Your Name"}</h2>
          <p className="text-gray-700">
            {formData.email || "your.email@example.com"}
          </p>
          <p className="text-gray-700">{formData.phone || "(123) 456-7890"}</p>
          <h3 className="font-bold mt-4">Education</h3>
          <p>{formData.education || "Your education details here."}</p>
          <h3 className="font-bold mt-4">Experience</h3>
          <p>{formData.experience || "Your work experience details here."}</p>
          <h3 className="font-bold mt-4">Skills</h3>
          <p>{formData.skills || "Your skills here."}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
