import { Avatar, Button, Dropdown, Form, Input } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { imageUrl } from "../../../../hooks/useHttps";
import { FaUser } from "react-icons/fa";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { HiOutlineUpload } from "react-icons/hi";
import { MdSettingsVoice } from "react-icons/md";
import { BsSendFill } from "react-icons/bs";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatForm from "./ChatForm";

const UserChat = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    setError("");
  };

  const handleSubmit = (e) => {
    if (inputMessage.trim() === "") {
      setError("لطفا پیام خود را اینجا بنویسید");
      return;
    }
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    setInputMessage("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-gradient-to-br from-blue-50 to-purple-50 border rounded-md">
      {/* selected chat datas */}
      <div className="w-full flex h-fit">
        <ChatHeader selectedChat={selectedChat} />
      </div>

      <div
        className="w-full h-fit flex flex-col-reverse flex-1 p-4 sm:p-6 overflow-y-auto my-auto"
        ref={chatContainerRef}
      >
        {selectedChat ? (
          <ChatBody messages={messages} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <span className="text-sm text-gray-500">
              برای شروع به صحبت, گفتگو را انتخاب کنید...
            </span>
          </div>
        )}
      </div>

      <div className="h-fit bg-white border-t border-gray-200 p-4 flex justify-center items-center">
        <ChatForm
          handleSubmit={handleSubmit}
          handleChange={handleInputChange}
          value={inputMessage}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UserChat;
