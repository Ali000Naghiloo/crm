import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import React, { useEffect, useState } from "react";
import { baseURL } from "../components/taskmanager/httpConfig/useHttp";
import { toast } from "react-toastify";
import formatHelper from "../helper/formatHelper";
import { imageUrl } from "../hooks/useHttps";
import { Avatar } from "antd";
import { BiUser } from "react-icons/bi";

export default function HandleNotification() {
  const siganlBaseUrl = baseURL.replace("api/", "");
  const [connection, setConnection] = useState(null);
  const accessToken = localStorage.getItem("token");

  const handleSignalConnection = async () => {
    try {
      const conn = new HubConnectionBuilder()
        .withUrl(`${siganlBaseUrl}ChatHubTaskManager`, {
          accessTokenFactory: () => accessToken,
        })
        .configureLogging(LogLevel.Information)
        .build();

      await conn.start().catch((error) => {
        console.error(error.toString());
      });
      // conn.invoke("api/Account/TestNotificationUserSignalR", {});

      conn.on("ReceiveNotification", (title, body, img) => {
        const icon = () => (
          <div className="w-[30px] h-[30px]">
            {img && img !== "userImage/null" ? (
              <img
                src={imageUrl + img}
                className="w-full h-full rounded-full"
                alt=""
              />
            ) : (
              <Avatar
                icon={<BiUser />}
                className="w-full h-full rounded-full"
              />
            )}
          </div>
        );
        const element = () => (
          <div className="w-full flex gap-2 items-center">
            <div className="flex-1 flex gap-2 flex-col">
              <p className="text-lg">{title}</p>
              <span>{formatHelper.cutString(body, 0, 200)}</span>
            </div>
          </div>
        );
        // نمایش نوتیفیکیشن با استفاده از API مرورگر
        toast.info(element, {
          position: "bottom-left",
          className: "w-[300px]",
          icon: icon,
        });
      });

      setConnection(conn);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleSignalConnection();
  }, []);

  useEffect(() => {
    if (connection) {
    }
  }, [connection]);

  return (
    <>
      <div className=""></div>
    </>
  );
}
