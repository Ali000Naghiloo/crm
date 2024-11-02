const ChatBody = ({ messages }) => {
  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
                message.sender === "user" ? "Your message" : "Responder message"
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

export default ChatBody;
