import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageRoutes } from "../../../store/reducers/pageRoutes";
import { HiRefresh } from "react-icons/hi";
import PageRoutes from "../../../common/PageRoutes";
import UsersList from "./usersList/UsersList";
import UserChat from "./userChat/UserChat";
import useHttp, { baseURL } from "../httpConfig/useHttp";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { toast } from "react-toastify";
import { Button } from "antd";

const Chat = () => {
  const siganlBaseUrl = baseURL.replace("api/", "");
  const { httpService } = useHttp();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [connection, setConnection] = useState(null);
  const accessToken = localStorage.getItem("token");

  const handleGetUsersList = async () => {
    let datas = [];
    setLoading(true);

    await httpService
      .get("/Account/GetAllUsers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          datas = res.data.data;
        }
      })
      .catch(() => {});

    setLoading(false);
    setUsersList(datas);
  };

  const handleSignalConnection = async () => {
    try {
      const conn = new HubConnectionBuilder()
        .withUrl(`${siganlBaseUrl}ChatHubTaskManager`, {
          accessTokenFactory: () => accessToken,
        })
        .configureLogging(LogLevel.Information)
        .build();

      await conn.start().catch((error) => {
        // console.error(error.toString());
      });

      conn.onclose((error) => {
        toast.warning(
          <div className="flex flex-col gap-2">
            <span>اتصال شما با سیستم اعلانات قطع شد!</span>
            <Button onClick={handleSignalConnection()}>
              اتصال مجدد <HiRefresh />
            </Button>
          </div>
        );
      });

      setConnection(conn);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    dispatch(setPageRoutes([{ label: "مدیریت پروژه" }, { label: "گفتگو" }]));

    handleGetUsersList();
    handleSignalConnection();
  }, []);

  useEffect(() => {
    // connection?.onclose((error) => {
    //   toast.warn(
    //     <div className="flex flex-col gap-2">
    //       <span>اتصال شما با سیستم اعلانات قطع شد!</span>
    //       <Button onClick={handleSignalConnection()}>
    //         اتصال مجدد <HiRefresh />
    //       </Button>
    //     </div>
    //   );
    // });

    connection?.on("UpdateOnlineUsers", (onlineUsers) => {
      const ouList = onlineUsers?.map((ou) => ou?.userId);
      const updatedUsers = usersList.map((user) => ({
        ...user,
        isOnline: ouList.includes(user.id), // Check if the user is online
      }));
      setUsersList(updatedUsers);
    });
  }, [connection]);

  return (
    <>
      <div className="w-full flex-col min-h-contentHeight max-h-contentHeight overflow-hidden">
        {/* page title */}
        <div className="w-full h-[10%] flex justify-between items-center text-4xl p-3 font-bold">
          <h1>گفتگو</h1>

          {/* <div className="flex items-center justify-center pl-5">
            <Button className="p-1" type="text" onClick={handleGetUsers}>
              <HiRefresh size={"2em"} />
            </Button>
          </div> */}

          {/* routes */}
          <div className="max-w-[20%]">
            <PageRoutes />
          </div>
        </div>

        {/* content */}
        <div className="w-full h-[90%] flex items-start justify-start">
          <UsersList
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            usersData={usersList}
            loading={loading}
          />
          <UserChat connection={connection} selectedChat={selectedChat} />
        </div>
      </div>
    </>
  );
};

export default Chat;
