import { Button, Dropdown, Tabs } from "antd";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { FaAngleLeft, FaTasks } from "react-icons/fa";
import { IoMdChatboxes, IoMdMore, IoMdSettings } from "react-icons/io";
import { PiColumnsPlusLeftFill, PiPushPinFill } from "react-icons/pi";
import useHttp from "../../../httpConfig/useHttp";
import { useNavigate, useSearchParams } from "react-router-dom";
import Group from "./groups/Group";
import Tasks from "./tasks/Tasks";
import Workflows from "./workflows/Workflows";

export default function Board() {
  const { httpService } = useHttp();
  const [serachParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState();
  const [boardData, setBoardData] = useState(null);
  const boardId = serachParams.get("boardId");
  const [showModal, setShowModal] = useState({
    open: false,
  });

  const boardOptions = [
    { key: 1, label: "تنظیمات", icon: <IoMdSettings /> },
    { key: 2, label: "پین کردن پروژ", icon: <PiPushPinFill /> },
  ];

  const BoardModal = lazy(() => import("../../../modals/BoardModal"));

  const handleGetBoardData = async () => {
    setLoading(true);
    const formData = { boardId: boardId };

    await httpService
      .get("/BoardController/EditBoard", { params: formData })
      .then((res) => {
        if (res.status == 200 && res.data?.code) {
          setBoardData(res.data.data);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleRenderContent = (type) => {
    if (type === "group") {
      return <Group boardId={boardId} />;
    }
    if (type === "tasks") {
      return <Tasks boardId={boardId} />;
    }
    if (type === "workflows") {
      return (
        <Workflows
          boardId={boardId}
          workflows={boardData?.boardWorkFlowsViewModel}
        />
      );
    } else {
      return <></>;
    }
  };

  const boardTabs = [
    {
      key: "group",
      children: handleRenderContent("group"),
      label: (
        <div className="flex items-center justify-center gap-2 text-xl pr-5">
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

  useEffect(() => {
    if (boardId) {
      handleGetBoardData();
    }
  }, [boardId]);

  return (
    <Suspense fallback={<></>}>
      <div className="w-full h-full min-h-contentHeight max-h-contentHeight flex flex-col gap-0 overflow-y-auto">
        {/* board data */}
        <div className="w-full h-[90px] flex justify-between p-5 border-gray-300 border-b-2 relative">
          <div
            onClick={() => setShowModal({ open: true })}
            className="w-full h-full z-0 absolute left-0 top-0 cursor-pointer"
          ></div>

          <div className="flex gap-2">
            <div
              className={`flex justify-center items-center w-[50px] h-[50px] text-white rounded-full ${
                boardData?.color ? `bg-[${boardData?.color}]` : "bg-gray-500"
              }`}
            >
              <span>
                {boardData?.name?.split(" ")
                  ? boardData?.name?.split(" ")[0][0]
                  : boardData?.name[0]}
              </span>
              <span>
                {boardData?.name?.split(" ") && boardData?.name?.split(" ")[1]
                  ? boardData?.name?.split(" ")[1][0]
                  : boardData?.name[0]}
              </span>
            </div>

            <div className="text-xl font-bold flex items-center">
              {boardData?.name}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dropdown
              menu={{ items: boardOptions }}
              className="h-full flex items-center justify-center"
            >
              <IoMdMore size={"2em"} />
            </Dropdown>

            <Button
              onClick={() => navigate(-1)}
              type="text"
              className="text-2xl p-0"
            >
              <span className="">بازگشت</span>
              <FaAngleLeft />
            </Button>
          </div>
        </div>

        {/* board tabs  */}
        <div className="w-full h-full overflow-x-auto">
          <Tabs
            defaultActiveKey="workflows"
            items={boardTabs}
            className="w-full p-0 pt-5 h-full"
          />
        </div>
      </div>

      <BoardModal
        getNewList={handleGetBoardData}
        open={showModal.open}
        setOpen={(e) => {
          setShowModal({ open: e });
        }}
        id={boardId}
        projectId={boardData?.peojectId}
      />
    </Suspense>
  );
}
