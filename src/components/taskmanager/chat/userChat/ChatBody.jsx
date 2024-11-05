import { Spin } from "antd";
import moment from "jalali-moment";
import { useSelector } from "react-redux";

const ChatBody = ({ messages }) => {
  const formatTimestamp = (date) => {
    if (date) return moment(date).utc().locale("fa").format("HH:mm");
    return "";
  };

  const userData = useSelector((state) => state.userData.userData);

  return (
    <>
      <div className="max-w-3xl space-y-4">
        {messages &&
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message?.senderFullName == userData?.fullName
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                  message?.senderFullName == userData?.fullName
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                } shadow-md transition-all duration-300 ease-in-out hover:shadow-lg`}
                aria-label={`${
                  message.sender === "user"
                    ? "Your message"
                    : "Responder message"
                }`}
              >
                <p className="text-sm sm:text-base">{message.messageText}</p>
                <p className="text-xs mt-1 text-right opacity-70">
                  {formatTimestamp(message.sentDate)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ChatBody;
