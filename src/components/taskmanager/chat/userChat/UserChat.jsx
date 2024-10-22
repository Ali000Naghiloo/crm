import { Avatar, Button, Dropdown, Form, Input } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { imageUrl } from "../../../../hooks/useHttps";
import { FaUser } from "react-icons/fa";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { HiOutlineUpload } from "react-icons/hi";
import { MdSettingsVoice } from "react-icons/md";
import { BsSendFill } from "react-icons/bs";

const UserChat = ({ selectedChat }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "سلام وقت بخیر",
      sender: "responder",
      timestamp: new Date(),
    },
    { id: 2, text: "حالت خوبه ؟ ", sender: "user", timestamp: new Date() },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);

  const chatOptions = [
    {
      key: "option-1",
      label: <span>آیتم اول</span>,
    },
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    simulateResponse();
  };

  const simulateResponse = () => {
    setTimeout(() => {
      const responseMessage = {
        id: messages.length + 2,
        text: "Thank you for your message. How else can I help you?",
        sender: "responder",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1000);
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const ChatHeader = () => {
    if (selectedChat) {
      return (
        <div className="w-full flex justify-between p-2 px-5 border-gray-300 border-[1px]">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              {imageUrl !== selectedChat?.imagePath ? (
                <img
                  src={selectedChat?.imagePath}
                  alt={selectedChat?.fullName}
                  className="w-[50px] h-[50px] rounded-full"
                />
              ) : (
                <Avatar icon={<FaUser />} />
              )}

              <div className="flex flex-col">
                <span className="text-lg">{selectedChat?.fullName}</span>
                <span className="text-sm text-gray-500">
                  آخرین بازدید در : 00:00
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Dropdown menu={{ items: chatOptions }}>
              <PiDotsThreeOutlineVerticalFill />
            </Dropdown>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const ChatBody = () => {
    return (
      <>
        <div className="max-w-3xl space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                } shadow-md transition-all duration-300 ease-in-out hover:shadow-lg`}
                aria-label={`${
                  message.sender === "user"
                    ? "Your message"
                    : "Responder message"
                }`}
              >
                <p className="text-sm sm:text-base">{message.text}</p>
                <p className="text-xs mt-1 text-right opacity-70">
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="w-full flex flex-col justify-between h-full bg-gradient-to-br from-blue-50 to-purple-50 border rounded-md">
      {/* selected chat datas */}
      <div className="w-full flex">
        <ChatHeader />
      </div>

      <div
        className="w-full h-full flex flex-col-reverse flex-1 p-4 sm:p-6 overflow-y-auto"
        ref={chatContainerRef}
      >
        {selectedChat ? (
          <ChatBody />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <span className="text-sm text-gray-500">
              برای شروع به صحبت, گفتگو را انتخاب کنید...
            </span>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4 pb-16">
        <Form
          onFinish={handleSubmit}
          className="max-w-3xl mx-auto flex items-center h-full"
        >
          <Input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="پیام خود را در اینجا وارد نمایید ..."
            aria-label="Message input"
            className="flex-1 border border-gray-300 rounded-l-none rounded-r-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* upload */}
          {/* <input type="file" hidden name="upload" /> */}
          <Button className="!h-full rounded-none" htmlType="submit">
            <HiOutlineUpload size={"1.5em"} />
          </Button>
          {/* voice */}
          <Button className="!h-full rounded-none" htmlType="submit">
            <MdSettingsVoice size={"1.5em"} />
          </Button>
          {/* submit */}
          <Button
            className="!h-full rounded-l rounded-r-none"
            htmlType="submit"
          >
            <BsSendFill />
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default UserChat;
