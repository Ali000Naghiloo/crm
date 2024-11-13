import { Button, Dropdown, Select, Skeleton } from "antd";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { IoMdMore } from "react-icons/io";
import useHttp from "../httpConfig/useHttp";
import { MdFilterList } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import Task from "../projects/boards/board/tasks/Task";
import Tasks from "../projects/boards/board/tasks/Tasks";

const loadings = ["", "", "", "", "", "", "", ""];

export default function MyTasks() {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(true);
  const [allTasksList, setAllTasksList] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    viewBy: "undone",
    sortBy: "default",
    filters: false,
  });
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showModal, setShowModal] = useState({ open: false, id: null });

  const viewByItems = [
    { key: "1", label: "کار های انجام نشده", value: "undone" },
  ];
  const sortBy = [{ key: "1", label: "پیش فرض", value: "default" }];
  const filters = [];

  const handleGetAllTasksList = async () => {
    setLoading(true);
    let datas = [];

    await httpService
      .get("/Dashboard/UserTasks")
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          datas = res.data?.data;
        }
      })
      .catch(() => {});

    setAllTasksList(datas);
    setLoading(false);
  };

  const onTaskClick = async (id) => {
    setShowModal({ open: true, id: id });
  };

  useEffect(() => {
    handleGetAllTasksList();
  }, []);

  return (
    <Suspense>
      <div className="w-full h-full min-h-contentHeight max-h-contentHeight">
        <Tasks />
      </div>
      {/* 
      <TaskModal
        open={showModal.open}
        boardId={boardId}
        workflowId={null}
        getNewList={handleGetAllTasksList}
        setOpen={(e) => setShowModal({ open: e })}
        id={showModal.id}
      /> */}
    </Suspense>
  );
}
