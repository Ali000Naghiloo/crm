import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageRoutes } from "../../../store/reducers/pageRoutes";
import useHttp from "../../../hooks/useHttps";
import { Button } from "antd";
import { HiRefresh } from "react-icons/hi";
import PageRoutes from "../../../common/PageRoutes";
import UsersList from "./usersList/UsersList";
import UserChat from "./userChat/UserChat";

const Chat = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { httpService } = useHttp();
  const [usersList, setUsersList] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  // const handleGetUsers = () => {};

  useEffect(() => {
    dispatch(setPageRoutes([{ label: "مدیریت پروژه" }, { label: "گفتگو" }]));
  }, []);

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
          />
          <UserChat selectedChat={selectedChat} />
        </div>
      </div>
    </>
  );
};

export default Chat;
