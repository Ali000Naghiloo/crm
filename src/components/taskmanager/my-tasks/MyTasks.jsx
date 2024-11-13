import { Button, Dropdown, Select, Skeleton } from "antd";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { IoMdMore } from "react-icons/io";
import useHttp from "../httpConfig/useHttp";
import { MdFilterList } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import Task from "../projects/boards/board/tasks/Task";

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
    <Suspense fallback={<></>}>
      <div className="w-full min-h-contentHeight max-h-contentHeight overflow-y-auto flex flex-col text-lg">
        {/* filters and sorts and show by */}
        <div className="w-full flex items-center justify-between p-8">
          <div className="flex gap-3">
            {/* show by */}
            <div className="flex items-center">
              <span>نمایش : </span>
              <Select
                variant="borderless"
                value={selectedOptions.viewBy}
                onChange={(e) => {
                  setSelectedOptions({ ...selectedOptions, viewBy: e });
                }}
                size="large"
                options={viewByItems}
                className="text-xl"
              />
            </div>

            {/* sort by */}
            <div className="flex items-center">
              <span>مرتب سازی : </span>
              <Select
                variant="borderless"
                value={selectedOptions.sortBy}
                onChange={(e) => {
                  setSelectedOptions({ ...selectedOptions, sortBy: e });
                }}
                size="large"
                options={sortBy}
                className="text-xl"
              />
            </div>

            {/* filter button */}
            <Button type="text" size="large" className="text-xl">
              <span>فیلتر </span>
              <MdFilterList />
            </Button>
          </div>

          {/* actions */}
          <div className="flex items-center">
            <Button
              onClick={() => onTaskClick(null)}
              type="primary"
              className="flex items-center justify-center p-5 bg-[#0f9d58]"
            >
              <FaPlus /> ایجاد وظیفه
            </Button>
          </div>
        </div>

        {/* list */}
        <div className="w-full h-full flex flex-col overflow-y-auto gap-3 px-5">
          {!loading ? (
            allTasksList && allTasksList?.length !== 0 ? (
              allTasksList?.map((task, index) => (
                <>
                  <Task
                    data={task}
                    key={index}
                    getNewList={handleGetAllTasksList}
                    onClick={() => onTaskClick(task?.id)}
                  />
                </>
              ))
            ) : (
              <div className="w-full h-full flex justify-center items-center pt-10 text-gray-500 text-xl">
                وظیفه ای وجود ندارد...
              </div>
            )
          ) : (
            <>
              {loadings.map((_, index) => (
                <Skeleton.Input
                  key={index}
                  style={{ width: "100%", height: "50px" }}
                />
              ))}
            </>
          )}
        </div>
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
