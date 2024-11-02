import React, { useEffect, useState } from "react";
import { Avatar, List, Skeleton, message } from "antd";
import useHttp from "../../../../hooks/useHttps";
import { TiUser } from "react-icons/ti";

const UsersList = ({ selectedChat, setSelectedChat, usersData }) => {
  const [loading, setLoading] = useState(false);
  // const [userData, setUserData] = useState([]);
  const { httpService } = useHttp();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);

  return (
    <div
      // id="scrollableDiv"
      //   onScroll={handleScroll}
      className="w-[300px] border-y border-l border-[rgba(140, 140, 140, 0.35)] h-full overflow-y-auto"
    >
      <List
        loading={usersData ? false : true}
        dataSource={usersData}
        renderItem={(item) => (
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
              avatar={<Avatar src={item.imagePath} icon={<TiUser />} />}
              title={item.fullName}
              // description={item.email}
            />
          </List.Item>
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
