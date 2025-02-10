import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  FiClock,
  FiRepeat,
  FiSave,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

const ReminderScheduler = () => {
  const [enabled, setEnabled] = useState(true);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [frequency, setFrequency] = useState("daily");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      user ? setEmail(user.email) : alert("Please log in to set reminders");
    });
  }, []);

  const handleSaveReminder = async () => {
    if (!email) return alert("Please sign in first");

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("http://localhost:5000/api/reminders/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, time: selectedTime, frequency, enabled }),
      });

      if (!response.ok) throw new Error("Save failed");
      setMessage({ type: "success", text: "Reminder saved successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h % 12 || 12;
        const minute = m === 0 ? "00" : "30";
        const period = h < 12 ? "AM" : "PM";
        times.push(`${hour}:${minute} ${period}`);
      }
    }
    return times;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <div className="text-center">
          <FiClock className="mx-auto w-12 h-12 text-blue-500 mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">
            Practice Reminders
          </h1>
          <p className="text-gray-600 mt-1">
            Stay consistent with your interview prep
          </p>
        </div>

        <div className="mt-4 bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-sm text-blue-800 font-semibold">
            {email || "Loading account..."}
          </p>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-3 text-sm rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <FiCheckCircle className="w-5 h-5" />
            ) : (
              <FiXCircle className="w-5 h-5" />
            )}
            {message.text}
          </motion.div>
        )}

        <div className="mt-6 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <span className="text-gray-700 font-medium">Enable Reminders</span>
          <motion.button
            onClick={() => setEnabled(!enabled)}
            className={`w-14 h-7 rounded-full p-1 flex items-center transition-all ${
              enabled ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <motion.div
              layout
              className="bg-white w-5 h-5 rounded-full shadow-md"
              animate={{ x: enabled ? 24 : 0 }}
            />
          </motion.button>
        </div>

        {enabled && (
          <>
            <div className="mt-4">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <FiClock className="w-5 h-5" />
                Select Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <FiRepeat className="w-5 h-5" />
                Repeat Frequency
              </label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {["daily", "weekly", "monthly"].map((option) => (
                  <motion.button
                    key={option}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFrequency(option)}
                    className={`p-3 text-sm rounded-lg font-medium transition-all ${
                      frequency === option
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveReminder}
          disabled={isSaving}
          className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <FiSave className="w-5 h-5" />
          {isSaving ? "Saving..." : "Save Settings"}
        </motion.button>
      </div>
    </div>
  );
};

export default ReminderScheduler;
