import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const TOTAL_QUESTIONS = 10;
const QUESTION_TIME = 120;
const TOTAL_TIME = 1200;

function AIInterviewer() {
  // Existing state variables
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null); // Ensure mediaRecorderRef is properly initialized
  const chunks = useRef([]);
  const canvasRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [webcamPosition, setWebcamPosition] = useState({ x: 20, y: 20 });
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [modelAnswer, setModelAnswer] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

  // Add new state variables at the top
  const [pastInterviews, setPastInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // New state variables for video features
  const [timer, setTimer] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [screenStream, setScreenStream] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const screenRecorderRef = useRef(null);
  const combinedVideoRef = useRef(null);
  const [savedVideos, setSavedVideos] = useState([]);

  // Add this function to save interviews

  const ImprovementChart = ({ interviews }) => {
    // Data processing
    const data = interviews.map((interview, index) => ({
      attempt: index + 1,
      score: interview.score,
      mistakes: interview.mistakes.length,
      time: interview.totalTime,
    }));

    // Color palette for charts
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
      <div className="space-y-6">
        {/* Score Trend Chart */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white border rounded-lg">
              <h4 className="text-sm font-medium mb-4">Score Trend</h4>
              <LineChart
                width={300}
                height={200}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="attempt"
                  label={{
                    value: "Attempt",
                    position: "bottom",
                  }}
                />
                <YAxis
                  label={{
                    value: "Score %",
                    angle: -90,
                    position: "left",
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </div>

            {/* Mistake Analysis Chart */}
            <div className="p-4 bg-white border rounded-lg">
              <h4 className="text-sm font-medium mb-4">Mistake Distribution</h4>
              <PieChart width={300} height={200}>
                <Pie
                  data={data}
                  dataKey="mistakes"
                  nameKey="attempt"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Key Insights</h4>
          <ul className="list-disc pl-4 space-y-2">
            <li className="text-gray-700">
              Average score improvement: {calculateAverageImprovement(data)}%
            </li>
            <li className="text-gray-700">
              Most common mistake: {findMostCommonMistake(interviews)}
            </li>
            <li className="text-gray-700">
              Response time trend: {calculateTimeTrend(data)}
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const calculateAverageImprovement = (data) => {
    if (data.length < 2) return "N/A";
    const improvements = [];
    for (let i = 1; i < data.length; i++) {
      improvements.push(data[i].score - data[i - 1].score);
    }
    return (
      improvements.reduce((a, b) => a + b, 0) / improvements.length
    ).toFixed(1);
  };

  const findMostCommonMistake = (interviews) => {
    const mistakeCounts = {};
    interviews.forEach((interview) => {
      interview.mistakes.forEach((m) => {
        if (m.type !== "unanswered") {
          // Exclude unanswered from common mistakes
          mistakeCounts[m.type] = (mistakeCounts[m.type] || 0) + 1;
        }
      });
    });
    const mostCommon = Object.entries(mistakeCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    return mostCommon ? `${mostCommon[0]} (${mostCommon[1]}x)` : "N/A";
  };

  const calculateTimeTrend = (data) => {
    if (data.length < 2) return "N/A";
    const first = data[0].time;
    const last = data[data.length - 1].time;
    if (first === 0) return "N/A"; // Prevent division by zero
    const trend = (((first - last) / first) * 100).toFixed(1);
    return trend > 0 ? `${trend}% faster` : `${Math.abs(trend)}% slower`;
  };

  useEffect(() => {
    const handleDrag = (event) => {
      setWebcamPosition({ x: event.clientX - 90, y: event.clientY - 60 });
    };
    document.addEventListener("mousemove", handleDrag);
    return () => document.removeEventListener("mousemove", handleDrag);
  }, []);

  useEffect(() => {
    // Load saved videos from localStorage
    const storedVideos = JSON.parse(localStorage.getItem("savedVideos")) || [];
    setSavedVideos(storedVideos);
  }, []);

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const screenTrack = screenStream.getVideoTracks()[0];
      const screenSettings = screenTrack.getSettings();

      canvas.width = screenSettings.width || 1280;
      canvas.height = screenSettings.height || 720;
      canvasRef.current = canvas;

      const webcamVideo = document.createElement("video");
      webcamVideo.srcObject = webcamStream;
      webcamVideo.play();

      const screenVideo = document.createElement("video");
      screenVideo.srcObject = screenStream;
      screenVideo.play();

      function drawFrame() {
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          webcamVideo,
          webcamPosition.x,
          webcamPosition.y,
          180,
          120
        );
        requestAnimationFrame(drawFrame);
      }
      drawFrame();

      const combinedStream = canvas.captureStream(30);
      screenStream
        .getAudioTracks()
        .forEach((track) => combinedStream.addTrack(track));
      webcamStream
        .getAudioTracks()
        .forEach((track) => combinedStream.addTrack(track));

      mediaRecorderRef.current = new MediaRecorder(combinedStream);
      chunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) =>
        chunks.current.push(event.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);

        const a = document.createElement("a");
        a.href = url;
        a.download = "screen-face-recording.webm";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    // Combined video setup
    const combineStreams = async () => {
      if (videoRef.current && screenStream) {
        const webcamStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        const combined = new MediaStream([
          ...screenStream.getTracks(),
          ...webcamStream.getVideoTracks(),
        ]);

        combinedVideoRef.current.srcObject = combined;
      }
    };

    combineStreams();
  }, [screenStream]);

  // Timer system
  useEffect(() => {
    const questionTimer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((t) => t - 1);
        setTotalElapsed((te) => te + 1);
      } else {
        handleNextQuestion();
      }
    }, 1000);

    return () => clearInterval(questionTimer);
  }, [timeLeft]);

  async function generateFeedback() {
    if (!answer.trim()) return;
    setLoading(true);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Evaluate this interview answer:
      - Question: ${question}
      - Answer: ${answer}
      Provide a brief constructive feedback.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setFeedback(response.text());
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedback("AI feedback unavailable.");
    }

    setLoading(false); // End loading
  }

  const handleNextQuestion = async () => {
    if (currentQuestionNumber < TOTAL_QUESTIONS) {
      // Check for unanswered question before proceeding
      if (!answer.trim()) {
        setMistakes((prev) => [
          ...prev,
          {
            text: "No answer provided",
            type: "unanswered",
            explanation: "Question was skipped without providing an answer.",
          },
        ]);
      } else {
        await generateFeedback();
      }

      setCurrentQuestionNumber((n) => n + 1);
      setTimeLeft(QUESTION_TIME);
      setAnswer("");
      setQuestion("");
      generateQuestion();
    } else {
      finishInterview();
    }
  };

  const saveInterview = () => {
    const newInterview = {
      date: new Date().toISOString(),
      jobRole,
      experience,
      questions: Array(TOTAL_QUESTIONS)
        .fill()
        .map((_, i) => ({
          question: questionHistory[i],
          answer: answerHistory[i],
          feedback: feedbackHistory[i],
        })),
      score,
      mistakes,
      totalTime: totalElapsed,
    };

    const updatedHistory = [newInterview, ...pastInterviews];
    setPastInterviews(updatedHistory);
    localStorage.setItem("interviewHistory", JSON.stringify(updatedHistory));
  };

  // Updated finishInterview function
  const finishInterview = () => {
    // Calculate remaining questions when interview ends
    const remainingQuestions = TOTAL_QUESTIONS - (currentQuestionNumber - 1);

    // Add remaining as unanswered mistakes
    const unansweredMistakes = Array(remainingQuestions).fill({
      text: "No answer provided",
      type: "unanswered",
      explanation: "Question was skipped without providing an answer.",
    });

    setMistakes((prev) => [...prev, ...unansweredMistakes]);

    // Calculate final score
    const totalMistakes = mistakes.length + remainingQuestions;
    const calculatedScore = Math.floor(
      ((TOTAL_QUESTIONS - totalMistakes) / TOTAL_QUESTIONS) * 100
    );

    setScore(calculatedScore);
    setShowScore(true);
    stopAllRecordings();
    saveInterview();
  };

  const stopAllRecordings = () => {
    mediaRecorderRef.current?.stop();
    screenRecorderRef.current?.stop();
    setIsRecording(false);
    stopTimer();
  };

  const startInterview = async (e) => {
    e.preventDefault();
    if (!jobRole || !experience) {
      alert("Please fill in both job role and experience level");
      return;
    }
    setInterviewStarted(true);
    setCurrentQuestionNumber(1);
    await generateQuestion();
  };

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
        .join(" ");
      setAnswer(transcript);
    };

    // Cleanup video resources
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // New video recording functions
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };

      mediaRecorder.start();
      startTimer();
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const stopVideoRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop());
    stopTimer();
  };

  // Timer functions
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Update existing functions to handle video
  const startListening = () => {
    recognitionRef.current?.start();
    startVideoRecording();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    stopVideoRecording();
  };

  const generateQuestion = async () => {
    setLoading(true);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a technical interview question for a ${experience}-level ${jobRole} position. 
  Focus on real-world scenarios that require practical technical knowledge and problem-solving skills. 
  The question should be clear, concise, and free from unnecessary symbols like asterisks (*), hashes (#), or other special characters. 
  Avoid overly complicated phrasing and ensure the question is straightforward and easy to understand.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setQuestion(response.text().trim()); // Remove any unnecessary whitespace or symbols
    } catch (error) {
      console.error("Error generating question:", error);
      setQuestion("Could not generate question. Please try again.");
    }
    setLoading(false);
  };

  // Add interview setup form
  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/20">
          <div className="text-center mb-8">
            <div className="animate-bounce mb-6">
              <span className="text-6xl">🤖</span>
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              AI Interview Coach
            </h1>
            <p className="text-gray-300">Get ready for your dream job</p>
          </div>

          <form onSubmit={startInterview} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-gray-100"
                    placeholder="Software Engineer"
                    required
                  />
                  <span className="absolute right-4 top-3 text-gray-400">
                    💼
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Experience Level
                </label>
                <div className="relative">
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-100 appearance-none"
                    required
                  >
                    <option value="" disabled className="text-gray-700">
                      Select experience
                    </option>
                    <option value="junior" className="text-gray-900">
                      Junior (0-2 years)
                    </option>
                    <option value="mid-level" className="text-gray-900">
                      Mid-Level (2-5 years)
                    </option>
                    <option value="senior" className="text-gray-900">
                      Senior (5+ years)
                    </option>
                  </select>
                  <span className="absolute right-4 top-3 text-gray-400">
                    📈
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="text-xl">🚀</span>
              Start Practice Session
            </button>
          </form>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Main Content */}
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800/60 backdrop-blur-md border-b border-white/10 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
            >
              <span className="text-lg">←</span>
              <span className="text-sm">Back</span>
            </button>

            {/* Time Section */}
            <div className="bg-gray-700/60 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg w-full sm:w-auto">
              <span className="text-blue-400 text-lg">⏳</span>
              <span className="font-mono text-white text-lg">
                {formatTime(totalElapsed)}
              </span>
            </div>

            {/* Score Section */}
            <div className="bg-gray-700/60 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg w-full sm:w-auto">
              <span className="text-purple-400 text-lg">❓</span>
              <span className="text-white text-lg">
                {currentQuestionNumber}/{TOTAL_QUESTIONS}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-24 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-2xl text-white text-center mb-6">
          <h3 className="text-xl font-bold mb-2">🎥 Screen & Face Recording</h3>

          <canvas ref={videoRef} className="w-full mb-4 rounded-lg" hidden />

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-5 py-2 rounded-full font-semibold text-lg transition-all shadow-lg ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isRecording ? "⏹ Stop Recording" : "▶ Start Recording"}
            </button>
          </div>

          {videoUrl && (
            <div className="mt-4 p-3 bg-white rounded-lg shadow-md text-gray-800">
              <h3 className="text-lg font-semibold mb-2">
                📼 Recorded Session
              </h3>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                🔗 Access Recorded Video
              </a>
            </div>
          )}
        </div>

        {/* Feedback & Analysis Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl mb-8">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-green-400">📊</span>
              Live Analysis
            </h2>
            <div className="flex-1 border-t border-white/10" />
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                comparisonMode
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-purple-500/20 text-purple-400"
              }`}
            >
              {comparisonMode ? "Detailed Analysis" : "Summary View"}
            </button>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700/50 rounded w-3/4" />
              <div className="h-4 bg-gray-700/50 rounded" />
              <div className="h-4 bg-gray-700/50 rounded w-5/6" />
            </div>
          ) : feedback ? (
            comparisonMode ? (
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                  <h3 className="text-sm font-medium text-green-400 mb-4">
                    AI Feedback Summary
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{feedback}</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                  <h3 className="text-sm font-medium text-blue-400 mb-4 flex items-center gap-2">
                    <span>💡</span>
                    Model Answer
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{modelAnswer}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-purple-400 mb-2">
                  Key Improvements
                </h3>
                {mistakes.map((mistake, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gray-900 rounded-lg border border-white/10 hover:border-purple-400/30 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`pt-1 ${
                          mistake.type === "grammar"
                            ? "text-red-400"
                            : mistake.type === "clarity"
                            ? "text-yellow-400"
                            : "text-purple-400"
                        }`}
                      >
                        {mistake.type === "grammar"
                          ? "🔠"
                          : mistake.type === "clarity"
                          ? "💬"
                          : "🎯"}
                      </div>
                      <div>
                        <p className="text-gray-300 mb-2">
                          <span className="bg-red-400/10 text-red-300 px-2 py-1 rounded">
                            {mistake.text}
                          </span>
                        </p>
                        <p className="text-gray-400 text-sm">
                          {mistake.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center p-8 text-gray-500">
              Your analysis will appear here as you respond...
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full px-4 max-w-screen-sm sm:max-w-none sm:w-auto">
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-gray-800/80 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-2xl border border-white/10 shadow-xl mx-auto">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all flex items-center gap-2 justify-center ${
                isRecording
                  ? "bg-red-500 hover:bg-red-400"
                  : "bg-green-500 hover:bg-green-400"
              }`}
            >
              {isRecording ? (
                <>
                  <span>⏹️</span>
                  <span className="hidden sm:inline">Stop Recording</span>
                </>
              ) : (
                <>
                  <span>🎥</span>
                  <span className="hidden sm:inline">Start Recording</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-blue-500 hover:bg-blue-400 font-semibold flex items-center gap-2 justify-center"
            >
              <span>⏭️</span>
              <span className="hidden sm:inline">Next Question</span>
            </button>
          </div>
        </div>

        {/* Progress Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Question Progress
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-blue-600"
                    strokeWidth="8"
                    strokeDasharray={`${(timeLeft / QUESTION_TIME) * 251} 251`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                  {QUESTION_TIME - timeLeft}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {currentQuestionNumber}
                  <span className="text-lg text-gray-500">
                    /{TOTAL_QUESTIONS}
                  </span>
                </p>
                <p className="text-sm text-gray-500">Current Question</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Performance Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-medium text-blue-600">
                  {(
                    100 -
                    (mistakes.length / currentQuestionNumber) * 100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="font-medium text-purple-600">
                  {formatTime(TOTAL_TIME - totalElapsed)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Skip Question Button */}
              <button
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                onClick={handleNextQuestion}
              >
                Skip Question
              </button>
              <div className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg w-full sm:w-auto">
                <span className="text-blue-400 text-lg">⏳</span>
                <span className="font-mono text-white text-lg">
                  {formatTime(totalElapsed)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Question & Answer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Current Question
              </h3>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                Difficulty: {experience}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
              <p className="text-gray-700 leading-relaxed">{question}</p>
            </div>
          </div>
          {/* Answer & Feedback Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Your Response
              </h3>
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRecording ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></span>
                <span className="text-sm text-gray-500">
                  {isRecording ? "Recording" : "Paused"}
                </span>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  generateLiveFeedback(e.target.value);
                }}
                placeholder="Start speaking or type your answer..."
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[150px]"
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <button
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <span className="material-icons text-red-500">mic_off</span>
                  ) : (
                    <span className="material-icons text-blue-500">mic</span>
                  )}
                </button>
              </div>
            </div>

            {/* Feedback Tabs */}
            {feedback ||
              (isLoading && (
                <div className="mt-6">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-4">
                      <button
                        onClick={() => setComparisonMode(true)}
                        className={`pb-2 px-1 ${
                          comparisonMode
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Analysis
                      </button>
                      <button
                        onClick={() => setComparisonMode(false)}
                        className={`pb-2 px-1 ${
                          !comparisonMode
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Summary
                      </button>
                    </nav>
                  </div>

                  {comparisonMode ? (
                    <div className="mt-4 space-y-4">
                      {/* Enhanced Analysis View */}
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <h4 className="font-medium mb-3 text-gray-700">
                          Key Improvements
                        </h4>
                        <div className="space-y-3">
                          {mistakes.map((mistake, i) => (
                            <div
                              key={i}
                              className="p-3 bg-white rounded-lg border border-gray-200 flex items-start space-x-3"
                            >
                              <div
                                className={`w-2 h-full rounded-lg ${
                                  mistake.type === "grammar"
                                    ? "bg-red-500"
                                    : mistake.type === "clarity"
                                    ? "bg-orange-500"
                                    : "bg-purple-500"
                                }`}
                              ></div>
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {mistake.text}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {mistake.explanation}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-green-50 rounded-xl">
                      <h4 className="font-medium mb-3 text-gray-700">
                        AI Summary
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {feedback}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Final Score Modal */}
        {showScore && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 transform transition-all">
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold mb-2">
                    Interview Complete!
                  </h2>
                  <p className="text-gray-600">Your final performance score</p>
                </div>

                <div className="mb-8">
                  <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                    <span className="text-6xl font-bold">{score}</span>
                    <span className="text-3xl">/100</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {TOTAL_QUESTIONS - mistakes.length}{" "}
                      {/* Fixed this line */}
                    </div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl">
                    <div className="text-2xl font-bold text-red-600">
                      {mistakes.length} {/* Fixed this line */}
                    </div>
                    <div className="text-sm text-gray-600">Total Mistakes</div>
                  </div>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-icons">replay</span>
                  Start New Interview
                </button>
              </div>
            </div>
          </div>
        )}

        {showHistory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Interview History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {pastInterviews.map((interview, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          {interview.jobRole} ({interview.experience})
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(interview.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {interview.score}%
                        </div>
                        <button
                          onClick={() =>
                            setSelectedInterview(
                              selectedInterview === index ? null : index
                            )
                          }
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {selectedInterview === index
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </div>
                    </div>

                    {selectedInterview === index && (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <h4 className="text-sm font-medium mb-2">
                              Strengths
                            </h4>
                            <ul className="list-disc pl-4">
                              {interview.mistakes
                                .filter((m) => m.type === "strength")
                                .map((m, i) => (
                                  <li key={i} className="text-green-700">
                                    {m.explanation}
                                  </li>
                                ))}
                            </ul>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg">
                            <h4 className="text-sm font-medium mb-2">
                              Areas to Improve
                            </h4>
                            <ul className="list-disc pl-4">
                              {interview.mistakes
                                .filter((m) => m.type !== "strength")
                                .map((m, i) => (
                                  <li key={i} className="text-red-700">
                                    {m.explanation}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>

                        <ImprovementChart
                          interviews={pastInterviews.slice(0, index + 1)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AIInterviewer;
