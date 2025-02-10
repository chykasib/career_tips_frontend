// Frontend (Next.js, Tailwind CSS, MongoDB, Gemini AI, Leaderboards, Notifications)
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import axios from "axios";

export default function ChallengeMode() {
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:5000/challenges")
      .then((res) => setChallenges(res.data));
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "update_scores") {
          setLeaderboard(data.challenge.results);
        }
      } catch (err) {
        console.error("WebSocket Error:", err);
      }
    };
    return () => ws.close();
  }, []);

  const createChallenge = async () => {
    try {
      const res = await axios.post("http://localhost:5000/challenges", {
        creator: "User123",
        participants: [],
        questions: [],
        status: "pending",
      });
      router.push(`/challenge/${res.data._id}`);
    } catch (err) {
      console.error("Error creating challenge:", err);
    }
  };

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-bold"
      >
        Challenge Mode
      </motion.h1>
      <motion.button
        onClick={createChallenge}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Create Challenge
      </motion.button>
      <ul className="mt-4">
        {challenges.map((challenge) => (
          <motion.li
            key={challenge._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-2 border rounded mt-2"
          >
            {challenge.creator} started a challenge
          </motion.li>
        ))}
      </ul>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        <ul>
          {leaderboard.map((entry, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="p-2 border rounded mt-2"
            >
              {index + 1}. {entry.user}: {entry.score} points
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
