import { Avatar, Button, Dropdown, Form, Input, Spin } from "antd";
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
import useHttp, { baseURL } from "../../httpConfig/useHttp";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useSearchParams } from "react-router-dom";

const UserChat = ({ selectedChat, connection }) => {
  const siganlBaseUrl = baseURL.replace("api/", "");
  const { httpService } = useHttp();
  const [messages, setMessages] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const accessToken = localStorage.getItem("token");
  const [searchParams] = useSearchParams();
  const currentUserId = searchParams.get("userId");

  const handleGetMessages = async () => {
    setMessages(null);
    setLoading(true);
    const formData = {
      receiverId: currentUserId ? currentUserId : selectedChat?.id,
    };
    let datas = [];

    await httpService
      .get("/ChatMessage/AllMessages", { params: formData })
      .then((res) => {
        if (res.data?.code == 1 && res.status == 200) {
          datas = res.data.data;
        }
      });

    setMessages(datas);
    setLoading(false);
  };

  const handleInputChange = async (e) => {
    setInputMessage(e.target.value);
    setError("");
  };

  const handleUpload = (e) => {
    console.log(e?.target?.files[0]);
  };

  const handleSubmit = async () => {
    const formData = {
      receiverId: selectedChat.id,
      messageText: inputMessage,
      originalMessageId: null,
      attachmentsCreateViewModel: [],
    };
    setInputMessage("");

    if (inputMessage.length !== 0 && !loading) {
      await httpService
        .post("/ChatMessage/CreateMessages", formData)
        .then((res) => {
          if (res.status == 200 && res.data?.code == 1) {
            handleGetMessages();
            inputRef.current?.focus();
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (currentUserId) {
      handleGetMessages();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (connection) {
      connection?.on("ReceiveMessage", (messages) => {
        if (selectedChat?.id || currentUserId) handleGetMessages();
      });
    }
  }, [connection]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-gradient-to-br from-blue-50 to-purple-50 border rounded-md">
      {/* selected chat datas */}
      <div className="w-full flex h-fit">
        <ChatHeader selectedChat={selectedChat} />
      </div>

      {selectedChat ? (
        messages ? (
          messages?.length !== 0 ? (
            <div
              className="w-full h-fit p-4 sm:p-6 overflow-y-auto mt-auto"
              ref={chatContainerRef}
            >
              <ChatBody messages={messages} ref={chatContainerRef} />
            </div>
          ) : (
            <div className="w-full flex justify-center items-center text-gray-500">
              پیامی وجود ندارد..
            </div>
          )
        ) : (
          <div className="w-full flex justify-center items-center">
            <Spin />
          </div>
        )
      ) : (
        <div className="w-full h-full flex justify-center items-center text-sm text-gray-500">
          برای شروع به صحبت, گفتگو را انتخاب کنید...
        </div>
      )}

      <div className="h-fit bg-white border-t border-gray-200 p-4 flex justify-center items-center">
        {currentUserId && (
          <ChatForm
            handleSubmit={handleSubmit}
            handleChange={handleInputChange}
            handleUpload={handleUpload}
            value={inputMessage}
            loading={loading}
            ref={inputRef}
          />
        )}
      </div>
    </div>
  );
};

export default UserChat;
