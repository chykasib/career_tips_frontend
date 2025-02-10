import clientPromise from "../../utils/mongoClient";
import sanitize from "mongo-sanitize";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, role, uid } = req.body;

      // Validate input
      if (!email || !role || !uid) {
        return res
          .status(400)
          .json({ message: "Email, role, and UID are required." });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      // Sanitize inputs
      const sanitizedEmail = sanitize(email.toLowerCase());
      const sanitizedRole = sanitize(role);
      const sanitizedUid = sanitize(uid);

      console.log("Received data:", {
        sanitizedEmail,
        sanitizedRole,
        sanitizedUid,
      });

      const client = await clientPromise;
      const db = client.db("career-tips");
      const usersCollection = db.collection("users");

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({
        $or: [{ email: sanitizedEmail }, { uid: sanitizedUid }],
      });

      console.log("Existing user:", existingUser);

      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      // Insert the new user with UID
      await usersCollection.insertOne({
        email: sanitizedEmail,
        role: sanitizedRole,
        uid: sanitizedUid, // Ensure UID is stored
      });

      res.status(200).json({ message: "User added successfully!" });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
