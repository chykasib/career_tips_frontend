import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaFileAlt,
  FaUserTie,
  FaBell,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

const ReminderScheduler = ({ onSave }) => {
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [loading, setLoading] = useState(false);

  const handleSaveReminder = async () => {
    setLoading(true);

    const reminderData = {
      reminderTime: selectedTime,
    };

    const response = await fetch("/api/reminders/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reminderData),
    });

    if (response.ok) {
      alert("Reminder saved successfully!");
      onSave(); // Callback to close or handle after saving
    } else {
      alert("Error saving reminder");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg w-full max-w-md mx-auto transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-center tracking-wide sm:text-2xl lg:text-3xl">
        ⏳ Set Practice Time
      </h2>

      <div className="flex items-center bg-gray-800 p-3 rounded-lg shadow-md transition-all duration-300 mb-4">
        <FaClock className="text-gray-400 mr-3" />
        <TimePicker
          value={selectedTime}
          onChange={setSelectedTime}
          disableClock={true}
          className="bg-transparent text-white w-full focus:outline-none"
        />
      </div>

      <button
        onClick={handleSaveReminder}
        className={`p-3 w-full text-white font-semibold rounded-lg transition-all duration-300 shadow-md ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transform hover:scale-105"
        }`}
        disabled={loading}
      >
        {loading ? "Saving..." : "✅ Save Reminder"}
      </button>
    </div>
  );
};

const UserSidebar = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReminderScheduler, setShowReminderScheduler] = useState(false); // State for showing ReminderScheduler

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/notifications?userId=${user.uid}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter((notif) => !notif.read).length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "PUT",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = (id) => {
    setLoading(true);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    setUnreadCount((prev) => Math.max(prev - 1, 0));
    setLoading(false);
  };

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-indigo-900 to-indigo-950 flex flex-col shadow-xl">
      <nav className="p-6 flex justify-between items-center border-b border-indigo-700">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          CareerHub
          <span className="block text-sm font-normal text-indigo-300 mt-1">
            User Dashboard
          </span>
        </h1>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xl relative p-2 rounded-full hover:bg-indigo-700 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell className="text-indigo-100" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 bg-red-500 text-xs font-bold px-2 rounded-full"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute right-0 mt-2 w-72 bg-indigo-800 text-white rounded-lg shadow-xl z-50 border border-indigo-700"
              >
                <div className="p-4 border-b border-indigo-700 flex justify-between items-center">
                  <h2 className="font-semibold text-lg">Notifications</h2>
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-indigo-300 hover:text-indigo-100 text-sm transition-colors"
                  >
                    Mark All as Read
                  </button>
                </div>
                <ul className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-800">
                  {notifications.length === 0 ? (
                    <li className="p-4 text-indigo-300 text-center">
                      No new notifications
                    </li>
                  ) : (
                    notifications.map((notif) => (
                      <motion.li
                        key={notif._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 flex justify-between items-center ${
                          notif.read ? "bg-indigo-900/30" : "bg-indigo-700/30"
                        } hover:bg-indigo-700/50 transition-colors border-b border-indigo-700/50 last:border-0`}
                      >
                        <div className="flex-1 pr-4">
                          <p className="text-sm text-indigo-100">
                            {notif.message}
                          </p>
                          <p className="text-xs text-indigo-400 mt-1">
                            {new Date(notif.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif._id)}
                              className="text-emerald-300 hover:text-emerald-100 transition-colors"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => dismissNotification(notif._id)}
                            className="text-red-300 hover:text-red-100 transition-colors"
                          >
                            <FaTimes className="text-sm" />
                          </button>
                        </div>
                      </motion.li>
                    ))
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <nav className="mt-8 flex-1 px-4">
        <ul className="space-y-2">
          {[
            { href: "/user/blogs", icon: <FaBook />, text: "Career Insights" },
            {
              href: "/user/resume-builder",
              icon: <FaFileAlt />,
              text: "Resume Builder",
            },
            {
              href: "/user/interview-preparation-guide",
              icon: <FaUserTie />,
              text: "Interview Prep",
            },
            {
              href: "/user/reminder-scheduler",
              icon: <FaClock />,
              text: "Set Reminder",
            },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={link.onClick}
                className="flex items-center px-4 py-3 rounded-xl hover:bg-indigo-700/30 transition-all group text-indigo-100 hover:text-white"
              >
                <span className="mr-3 text-xl text-indigo-300 group-hover:text-indigo-100 transition-colors">
                  {link.icon}
                </span>
                <span className="text-lg font-medium tracking-wide">
                  {link.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default UserSidebar;
