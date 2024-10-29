import React, { useEffect, useState } from "react";
import { Avatar, List, Skeleton, message } from "antd";
import useHttp from "../../../../hooks/useHttps";
import { TiUser } from "react-icons/ti";

const UsersList = ({ selectedChat, setSelectedChat }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const { httpService } = useHttp();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);

  const loadUserData = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await httpService.get(`/Account/GetAllUsers?page=${page}`);
      if (
        res.status === 200 &&
        res.data?.code === 1 &&
        Array.isArray(res.data.data)
      ) {
        const formattedData = res.data.data.map((data, index) => ({
          ...data,
          key: data.email || index,
        }));
        setUserData((prevData) => [...prevData, ...formattedData]);

        if (res.data.data.length === 0) {
          setHasMore(false);
        }
      }
    } catch (error) {
      message.error("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoad) {
      loadUserData();
      setInitialLoad(true);
    }
  }, [initialLoad]);

  useEffect(() => {
    if (page > 1) {
      loadUserData();
    }
  }, [page]);

  //   const handleScroll = (e) => {
  //     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
  //     if (scrollHeight - scrollTop === clientHeight && !loading && hasMore) {
  //       setPage((prevPage) => prevPage + 1); // Load next page when at the bottom
  //     }
  //   };

  return (
    <div
      // id="scrollableDiv"
      //   onScroll={handleScroll}
      className="w-[300px] border-y border-l border-[rgba(140, 140, 140, 0.35)] h-full overflow-y-auto"
    >
      <List
        dataSource={userData}
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
        {loading && (
          <div className="flex flex-col">
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
