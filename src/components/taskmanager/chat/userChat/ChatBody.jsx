import { Spin } from "antd";
import moment from "jalali-moment";
import { useState } from "react";
import { useSelector } from "react-redux";

const ChatBody = ({ messages }) => {
  const [prevDate, setPrevDate] = useState(null);

  const formatTimestamp = (date) => {
    if (date) return moment(date).utc().locale("fa").format("HH:mm");
    return "";
  };

  const userData = useSelector((state) => state.userData.userData);

  return (
    <>
      <div className="max-w-3xl flex flex-col-reverse">
        {messages &&
          messages.map((message, index) => {
            let prevData = messages[index - 1]?.sentDate
              ? moment(messages[index - 1]?.sentDate)
                  .utc()
                  .locale("fa")
                  .format("YYYY/MM/DD")
              : null;
            let currentDate = moment(message?.sentDate)
              .utc()
              .locale("fa")
              .format("YYYY/MM/DD");
            return (
              <div
                key={message.id}
                className={`flex flex-col justify-end my-1 ${
                  message?.senderFullName == userData?.fullName
                    ? "items-start"
                    : "items-end"
                }`}
              >
                {
                  <section className="w-full flex justify-center text-xs text-gray-500">
                    {currentDate}
                  </section>
                }
                <div
                  className={`w-fit max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-3 py-1 ${
                    message?.senderFullName == userData?.fullName
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
                  } shadow-md transition-all duration-300 ease-in-out hover:shadow-lg`}
                >
                  <p className="text-sm sm:text-base">{message.messageText}</p>
                  <p className="text-xs mt-1 text-right opacity-70">
                    {formatTimestamp(message?.sentDate)}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ChatBody;
