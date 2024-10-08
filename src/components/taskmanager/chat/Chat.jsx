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

  // const handleGetUsers = () => {};

  useEffect(() => {
    dispatch(setPageRoutes([{ label: "مدیریت پروژه" }, { label: "گفتگو" }]));
  }, []);

  return (
    <>
      <div className="w-full min-h-pagesHeight p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>گفتگو</h1>

          {/* <div className="flex items-center justify-center pl-5">
            <Button className="p-1" type="text" onClick={handleGetUsers}>
              <HiRefresh size={"2em"} />
            </Button>
          </div> */}
        </div>

        {/* routes */}
        <div>
          <PageRoutes />
        </div>

        {/* options */}
        <div className="flex flex-col gap-5 py-5">
          {/* <Button className="w-full" type="primary" size="large">
            خروجی جدول
          </Button> */}
          <Button
            className="w-full"
            type="primary"
            size="large"
            // onClick={() => setCreateCustomerModal({ open: true })}
          >
            گفتگو جدید
          </Button>
        </div>

        {/* content */}
        <div className=" flex items-start"> 
        <UsersList />
        <UserChat/>
        </div>
      </div>
    </>
  );
};

export default Chat;
