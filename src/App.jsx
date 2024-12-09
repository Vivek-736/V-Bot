/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import ReactLoading from "react-loading";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBotResponse = async (userInput) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA09Heo4lvW8gxAib3i8QaYihnkW9ZzgTI`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userInput,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const botResponse =
      data.candidates[0]?.content?.parts[0]?.text || "No response available.";
    return botResponse;
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    const botResponse = await fetchBotResponse(input);
    const botMessage = { sender: "bot", text: botResponse };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col">
        <div className="bg-gray-800 text-white rounded-t-lg text-center p-4">
          <h1 className="text-2xl font-semibold">Ask For Anything</h1>
        </div>

        {/* Chat Area */}
        <div className="h-[70vh] overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 max-w-md rounded-lg shadow-md ${
                message.sender === "user"
                  ? "bg-blue-500 text-white ml-auto text-right"
                  : "bg-gray-200 text-gray-900 mr-auto text-left"
              }`}
            >
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="flex items-center justify-center">
              <ReactLoading
                type="bubbles"
                color="gray"
                height={40}
                width={40}
              />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t flex items-center gap-3">
          <input
            type="text"
            className="flex-grow p-3 bg-gray-100 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Start typing to ask something...."
          />
          <button
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
