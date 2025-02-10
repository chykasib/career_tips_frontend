import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaFileAlt,
  FaUserTie,
  FaBell,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
const UserSidebar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch notifications from the backend
        const response = await fetch("http://localhost:5000/api/notifications");
        const data = await response.json();

        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter((notif) => !notif.read).length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // WebSocket connection for receiving new notifications
    const newSocket = new WebSocket("ws://localhost:5000");
    newSocket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    setSocket(newSocket);

    // Cleanup the socket connection when component unmounts
    return () => newSocket.close();
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "PUT", // Mark notification as read
      });

      if (res.ok) {
        // Update local state to reflect the read status
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === id ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0)); // Decrease unread count
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const dismissNotification = (id) => {
    // Remove the notification from the state
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    setUnreadCount((prev) => Math.max(prev - 1, 0)); // Decrease unread count
  };

  const markAllAsRead = () => {
    // Mark all notifications as read
    setNotifications((prev) =>
      prev.map((notif) => (notif.read ? notif : { ...notif, read: true }))
    );
    setUnreadCount(0); // Set unread count to 0
  };

  return (
    <div className="min-h-screen w-72 bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col shadow-xl border-r border-gray-700">
      <nav className="p-6 flex justify-between items-center border-b border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            CareerHub
          </h1>
          <p className="text-sm text-gray-400 mt-1">User Dashboard</p>
        </div>
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 relative rounded-lg hover:bg-gray-700 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell className="text-gray-200 text-xl" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-xs font-bold px-2 rounded-full"
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
                className="absolute right-0 mt-2 w-80 bg-gray-800 text-white rounded-lg shadow-xl z-50 border border-gray-700"
              >
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="font-semibold text-lg">Notifications</h2>
                  <button
                    onClick={markAllAsRead}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Mark All as Read
                  </button>
                </div>
                <ul className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  {notifications.length === 0 ? (
                    <li className="p-4 text-gray-400 text-center">
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
                          notif.read ? "bg-gray-900/30" : "bg-blue-900/10"
                        } hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 last:border-0`}
                      >
                        <div className="flex-1 pl-4">
                          <p className="text-sm text-gray-100">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif._id)}
                              className="text-green-400 hover:text-green-300 transition-colors p-1"
                            >
                              <FaCheck className="text-sm" />
                            </button>
                          )}
                          <button
                            onClick={() => dismissNotification(notif._id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
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
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center px-4 py-3 rounded-xl hover:bg-gray-700/30 transition-all text-gray-300 hover:text-white"
              >
                <span className="mr-3 text-xl text-blue-400 group-hover:text-blue-300 transition-colors">
                  {link.icon}
                </span>
                <span className="text-lg font-medium tracking-wide">
                  {link.text}
                </span>
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">
                  →
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
