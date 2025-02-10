import { OpenAI } from "openai";

// Create an OpenAI client using the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in .env.local
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { jobRole, experienceLevel } = req.body;

    if (!jobRole || !experienceLevel) {
      return res
        .status(400)
        .json({ error: "Job role and experience level are required" });
    }

    try {
      // Generate questions using the GPT model
      const response = await openai.completions.create({
        model: "text-davinci-003",
        prompt: `Generate interview questions for a ${jobRole} with ${experienceLevel} experience.`,
        max_tokens: 150,
      });

      // Extract and clean the response
      const questions = response.choices[0].text
        .trim()
        .split("\n")
        .filter(Boolean);

      // Respond with the generated questions
      res.status(200).json({ questions });
    } catch (error) {
      console.error("OpenAI API error:", error.response || error.message);
      res.status(500).json({ error: "Failed to generate questions" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
