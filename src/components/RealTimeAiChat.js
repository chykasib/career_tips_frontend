import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FaRobot,
  FaMicrophone,
  FaPaperclip,
  FaSmile,
  FaRegTimesCircle,
} from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null); // Ref for the bottom of the chat

  const toggleChat = () => setIsOpen(!isOpen);
  const handleInputChange = (e) => setInput(e.target.value);

  // Scroll to the bottom of the messages list when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // Run scrollToBottom when messages change

  // Send message to the AI and get a response
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { text, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(text);
      const response = await result.response;
      setMessages([...newMessages, { text: response.text(), sender: "ai" }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          text: "⚠️ Sorry, I'm having trouble connecting. Please try again later.",
          sender: "ai",
        },
      ]);
    }
    setIsLoading(false);
  };

  // Start listening for speech
  const startListening = () => {
    setIsListening(true);
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput(speechToText);
      sendMessage(speechToText);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // Stop listening for speech
  const stopListening = () => {
    setIsListening(false);
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.stop();
  };

  // Select emoji and append to the input field
  const selectEmoji = (emoji) => {
    setInput(input + emoji.emoji);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <FaRobot size={28} />
        </button>
      )}

      {isOpen && (
        <div className="w-96 bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col transform transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaRobot className="text-xl" />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button
              onClick={toggleChat}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaRegTimesCircle className="text-lg" />
            </button>
          </div>

          <div className="flex-1 p-4 bg-gray-50 overflow-y-auto max-h-[70vh]">
            {/* Chat messages container */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white shadow-md rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.sender === "ai" && (
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <FaRobot className="text-blue-500" />
                      <span>AI Assistant</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="typing-animation">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t relative">
            {showEmojiPicker && (
              <div className="absolute bottom-16 right-0 z-10">
                <EmojiPicker
                  onEmojiClick={selectEmoji}
                  pickerStyle={{ width: "100%", boxShadow: "none" }}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaSmile className="text-gray-500 hover:text-blue-600" />
              </button>

              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
              />

              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${
                  isListening
                    ? "text-red-500 bg-red-100"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <FaMicrophone />
              </button>

              <button
                onClick={() => sendMessage(input)}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                <BsSend />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .typing-animation {
          display: flex;
          align-items: center;
          padding: 1rem;
        }
        .typing-animation .dot {
          animation: typing 1.4s infinite ease-in-out;
          background-color: #ccc;
          border-radius: 50%;
          height: 6px;
          margin-right: 4px;
          width: 6px;
        }
        .typing-animation .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-animation .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}
