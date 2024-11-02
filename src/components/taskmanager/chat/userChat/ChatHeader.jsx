import { Avatar, Dropdown, Image } from "antd";
import { FaUser } from "react-icons/fa";
import { imageUrl } from "../../httpConfig/useHttp";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

const ChatHeader = ({ selectedChat }) => {
  const chatOptions = [
    {
      key: "option-1",
      label: <span>آیتم اول</span>,
    },
  ];

  if (selectedChat) {
    return (
      <div className="w-full flex justify-between p-2 px-5 border-gray-300 border-[1px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <div className="w-[50px] h-[50px]">
              {imageUrl !== selectedChat?.imagePath ? (
                <Image
                  src={selectedChat?.imagePath}
                  alt={selectedChat?.fullName}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <Avatar icon={<FaUser />} />
              )}
            </div>

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

export default ChatHeader;
