import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import { PiColumnsPlusLeftFill } from "react-icons/pi";

export default function Board() {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState();

  const handleRenderContent = (type) => {
    if (type === "group") {
      return <div className="w-full h-full">گروه برد</div>;
    }
    if (type === "tasks") {
      return <div className="w-full h-full">وظایف برد</div>;
    }
    if (type === "workflows") {
      return <div className="w-full">ستون ها برد</div>;
    } else {
      return <></>;
    }
  };

  const boardTabs = [
    {
      key: "group",
      children: handleRenderContent("group"),
      label: (
        <div className="flex items-center justify-center gap-2 text-xl">
          <IoMdChatboxes size={"1.4em"} />
          <span>گروه برد</span>
        </div>
      ),
    },
    {
      key: "tasks",
      children: handleRenderContent("tasks"),
      label: (
        <div className="flex items-center justify-center gap-2 text-xl">
          <FaTasks size={"1.4em"} />
          <span>وظایف برد</span>
        </div>
      ),
    },
    {
      key: "workflows",
      children: handleRenderContent("workflows"),
      label: (
        <div className="flex items-center justify-center gap-2 text-xl">
          <PiColumnsPlusLeftFill size={"1.4em"} />
          <span>کانبان برد</span>
        </div>
      ),
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <div className="max-h-pagesHeight w-full">
        {/* board data */}
        <div></div>

        {/* board tabs  */}
        <div className="w-full h-full p-5">
          <Tabs items={boardTabs} />
        </div>
      </div>
    </>
  );
}
