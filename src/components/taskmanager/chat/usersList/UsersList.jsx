import React, { useEffect, useState } from "react";
import { Avatar, List, Skeleton, message } from "antd";
import useHttp from "../../httpConfig/useHttp";
import { TiUser } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CiSaveDown2 } from "react-icons/ci";

const UsersList = ({ selectedChat, setSelectedChat, usersData, loading }) => {
  const { httpService } = useHttp();
  const [sortedItems, setSortedItems] = useState([]);

  const userData = useSelector((state) => state.userData.userData);

  useEffect(() => {
    if (usersData) {
      const sortedItems = [
        ...usersData.filter((user) => user.id === userData?.id),
        ...usersData.filter((user) => user.id !== userData?.id),
      ];
      setSortedItems(sortedItems);
    }
  }, [usersData]);

  return (
    <div
      // id="scrollableDiv"
      //   onScroll={handleScroll}
      className="w-[300px] border-y border-l border-[rgba(140, 140, 140, 0.35)] h-full overflow-y-auto"
    >
      <List
        loading={loading}
        dataSource={sortedItems}
        renderItem={(item, index) => (
          <Link to={`/taskmanager/chat?userId=${item.id}`}>
            <List.Item
              className={`!px-2 hover:cursor-pointer transition-all duration-200 ease-in ${
                selectedChat?.id === item.id
                  ? "bg-gray-300"
                  : "hover:bg-[#00000015]"
              }`}
              key={item.key}
              onClick={() => {
                setSelectedChat(item);
              }}
            >
              <List.Item.Meta
                className="max-w-full"
                avatar={
                  index == 0 ? (
                    <Avatar className="bg-blue-500" icon={<CiSaveDown2 />} />
                  ) : (
                    <Avatar src={item.imagePath} icon={<TiUser />} />
                  )
                }
                title={index == 0 ? "پیام های ذخیره شده" : item.fullName}
                // description={item.email}
              />
            </List.Item>
          </Link>
        )}
      >
        {!usersData && (
          <div className="flex flex-col">
            <Skeleton avatar paragraph={{ rows: 1 }} active />
            <Skeleton avatar paragraph={{ rows: 1 }} active />
            <Skeleton avatar paragraph={{ rows: 1 }} active />
            <Skeleton avatar paragraph={{ rows: 1 }} active />
            <Skeleton avatar paragraph={{ rows: 1 }} active />
            <Skeleton avatar paragraph={{ rows: 1 }} active />
            <Skeleton avatar paragraph={{ rows: 1 }} active />
          </div>
        )}
      </List>
    </div>
  );
};

export default UsersList;
