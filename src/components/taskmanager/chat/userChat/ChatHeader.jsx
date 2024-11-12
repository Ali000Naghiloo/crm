import { Avatar, Dropdown, Image } from "antd";
import { FaUser } from "react-icons/fa";
import { imageUrl } from "../../httpConfig/useHttp";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { CiSaveDown2 } from "react-icons/ci";

const ChatHeader = ({ selectedChat }) => {
  const chatOptions = [
    {
      key: "option-1",
      label: <span>آیتم اول</span>,
    },
  ];

  const user = useSelector((state) => state?.userData?.userData);

  if (selectedChat && user?.id !== selectedChat?.id) {
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
    return (
      <div className="w-full flex justify-between p-2 px-5 border-gray-300 border-[1px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <div className="w-[50px] h-[50px]">
              <Avatar
                icon={<CiSaveDown2 />}
                className="w-full h-full bg-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg">پیام های ذخیره شده</span>
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
  }
};

export default ChatHeader;
