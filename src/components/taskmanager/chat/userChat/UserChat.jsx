import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";

const UserChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "سلام وقت بخیر", sender: "responder", timestamp: new Date() },
    { id: 2, text: "حالت خوبه ؟ ", sender: "user", timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") {
      setError("لطفا پیام خود را اینجا بنویسید");
      return;
    }
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    setInputMessage("");
    simulateResponse();
  };

  const simulateResponse = () => {
    setTimeout(() => {
      const responseMessage = {
        id: messages.length + 2,
        text: "Thank you for your message. How else can I help you?",
        sender: "responder",
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="sm:w-full flex flex-col h-[70vh] bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto" ref={chatContainerRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} shadow-md transition-all duration-300 ease-in-out hover:shadow-lg`}
                aria-label={`${message.sender === 'user' ? 'Your message' : 'Responder message'}`}
              >
                <p className="text-sm sm:text-base">{message.text}</p>
                <p className="text-xs mt-1 text-right opacity-70">
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="پیام خود را در اینجا وارد نمایید ..."
            aria-label="Message input"
            className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="bg-blue-500 text-white rounded-r-lg py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default UserChat;