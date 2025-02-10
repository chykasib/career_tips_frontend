// pages/api/challenge/[id].js
import { MongoClient } from "mongodb";

const uri = process.env.DBURL;
const client = new MongoClient(uri);

async function handler(req, res) {
  const { id } = req.query;

  await client.connect();
  const database = client.db("career");
  const challenges = database.collection("challenges");

  if (req.method === "GET") {
    // Fetch challenge
    const challenge = await challenges.findOne({ challengeId: id });
    res.status(200).json(challenge);
  } else if (req.method === "POST") {
    // Update challenge code
    const { code } = req.body;
    await challenges.updateOne({ challengeId: id }, { $set: { code } });
    res.status(200).json({ message: "Code updated" });
  }

  await client.close();
}

export default handler;
