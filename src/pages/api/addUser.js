// pages/api/addUser.js
import clientPromise from "../../utils/mongoClient";
import sanitize from "mongo-sanitize";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, role } = req.body;

      // Validate input
      if (!email || !role) {
        return res
          .status(400)
          .json({ message: "Email and role are required." });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      // Sanitize inputs
      const sanitizedEmail = sanitize(email);
      const sanitizedRole = sanitize(role);

      const client = await clientPromise;
      const db = client.db("career-tips");
      const usersCollection = db.collection("users");

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({
        email: sanitizedEmail,
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Insert the new user
      await usersCollection.insertOne({
        email: sanitizedEmail,
        role: sanitizedRole,
      });
      res.status(200).json({ message: "User added successfully!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
