import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

function LiveFeedbackAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [modelAnswer, setModelAnswer] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    recognitionRef.current = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onend = () => setIsRecording(false);

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setAnswer(transcript);
      generateLiveFeedback(transcript);
    };
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const generateLiveFeedback = async (text) => {
    if (!text.trim() || !question.trim()) return;

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Evaluate this answer:\n\nQuestion: ${question}\nAnswer: ${text}\n
        Provide:
        1. Concise feedback in 1 sentence
        2. A model answer
        3. List of mistakes with:
           - Exact text snippet
           - Mistake type (grammar/clarity/relevance)
           - Brief explanation
        Format response as:
        Feedback: [feedback]
        Model Answer: [model answer]
        Mistakes:
        - "[text]" (Type: [type]) - [explanation]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Parse response
      const feedbackMatch = responseText.match(/Feedback: (.*)/);
      const modelAnswerMatch = responseText.match(/Model Answer: (.*)/);
      const mistakesMatches = [
        ...responseText.matchAll(/- "(.*?)" \(Type: (.*?)\) - (.*?)(\n|$)/g),
      ];

      setFeedback(feedbackMatch?.[1] || "No feedback available.");
      setModelAnswer(modelAnswerMatch?.[1] || "");
      setMistakes(
        mistakesMatches.map((match) => ({
          text: match[1],
          type: match[2].toLowerCase(),
          explanation: match[3],
        }))
      );
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback("❌ Unable to generate feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const highlightMistakes = (text) => {
    if (!mistakes.length) return text;

    let highlighted = text;
    mistakes.forEach(({ text: snippet, type }) => {
      const color =
        {
          grammar: "text-red-600 bg-red-100",
          clarity: "text-orange-600 bg-orange-100",
          relevance: "text-purple-600 bg-purple-100",
        }[type] || "";

      highlighted = highlighted.replaceAll(
        snippet,
        `<span class="highlight ${color} px-1 rounded">${snippet}</span>`
      );
    });
    return highlighted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Interview Assistant
          </span>
          🚀
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your interview question here..."
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                generateLiveFeedback(e.target.value);
              }}
              placeholder="Start speaking or type your answer here..."
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows="5"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={isRecording ? stopListening : startListening}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? (
                <span className="text-white text-2xl">⏹</span>
              ) : (
                <span className="text-white text-2xl">🎤</span>
              )}
            </button>

            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                comparisonMode
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {comparisonMode ? "Exit Comparison" : "Compare with AI"}
            </button>
          </div>

          {comparisonMode ? (
            <div className="mt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 text-gray-700">
                    Your Answer{" "}
                    {mistakes.length > 0 && `(${mistakes.length} issues)`}
                  </h3>
                  <div
                    className="p-4 border rounded-lg bg-gray-50 prose"
                    dangerouslySetInnerHTML={{
                      __html: highlightMistakes(answer),
                    }}
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-gray-700">
                    Model Answer
                  </h3>
                  <div className="p-4 border rounded-lg bg-gray-50 prose">
                    {modelAnswer}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-3 text-gray-700">
                  Mistake Legend
                </h4>
                <div className="flex gap-4">
                  {["grammar", "clarity", "relevance"].map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-sm ${
                          type === "grammar"
                            ? "bg-red-500"
                            : type === "clarity"
                            ? "bg-orange-500"
                            : "bg-purple-500"
                        }`}
                      />
                      <span className="text-sm capitalize">{type}</span>
                    </div>
                  ))}
                </div>

                {mistakes.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {mistakes.map((mistake, i) => (
                      <div
                        key={i}
                        className="text-sm p-2 bg-white rounded border"
                      >
                        <span
                          className={`font-medium ${
                            mistake.type === "grammar"
                              ? "text-red-600"
                              : mistake.type === "clarity"
                              ? "text-orange-600"
                              : "text-purple-600"
                          }`}
                        >
                          {mistake.text}
                        </span>
                        <span className="text-gray-600">
                          {" "}
                          - {mistake.explanation}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            (feedback || isLoading) && (
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-blue-500 text-xl">💡</span>
                  <h3 className="font-medium text-gray-800">AI Feedback</h3>
                  {isLoading && (
                    <span className="ml-2 text-gray-500 text-sm">
                      <svg
                        className="animate-spin h-4 w-4 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  )}
                </div>
                {!isLoading && (
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {feedback}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveFeedbackAI;
