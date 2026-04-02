import imageAI from "./../Ai.png";
import { useState, useEffect } from "react";

export default function AiAssetente() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [convId, setConvId] = useState(""); // ✅ conversation ID

  // 🔹 Generate convId once when component mounts
  useEffect(() => {
    let storedId = localStorage.getItem("convId");
    if (!storedId) {
      storedId = `conv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem("convId", storedId);
    }
    setConvId(storedId);
  }, []);

  const toggleShow = () => setShow(!show);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    // Show user's message immediately
    setMessages((prev) => [...prev, { sender: "You", text: userMessage }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: userMessage, convId }), // ✅ send convId
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { sender: "AI", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "⚠️ Error contacting AI server." },
      ]);
      console.error(err);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* AI Logo Button */}
      <img
        src={imageAI}
        alt="AI Assistant"
        className="w-16 h-16 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
        onClick={toggleShow}
      />

      {/* Popup Chat Window */}
      {show && (
        <div className="mt-2 w-80 bg-white shadow-xl rounded-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 font-semibold flex justify-between items-center">
            AI Assistant
            <button onClick={toggleShow} className="text-white font-bold">
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-2 h-64 overflow-y-auto bg-gray-50">
            {messages.length === 0 && (
              <div className="text-gray-400 text-sm">
                Say hi to your AI assistant!
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                    msg.sender === "You"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex p-2 border-t border-gray-200">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}