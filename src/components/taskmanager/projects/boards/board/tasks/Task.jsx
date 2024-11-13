import { Checkbox } from "antd";
import React, { useState } from "react";
import useHttp from "../../../../httpConfig/useHttp";
import { toast } from "react-toastify";
import { MdOutlineChecklistRtl } from "react-icons/md";

export default function Task({ data, getNewList, onClick }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  const handleChangeTaskStatus = async () => {
    setLoading(true);
    const formData = {
      taskid: data?.id,
    };

    await httpService
      .get("/TaskController/TaskDoneStatus", { params: formData })
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          toast.success("وضعیت وظیفه با موفقیت تغییر پیدا کرد");
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  return (
    <>
      <div
        className={`w-full h-full flex justify-between items-center rounded-lg shadow-md border border-gray-300 py-3 px-5 cursor-pointer hover:bg-gray-100 bg-white relative`}
      >
        <div
          onClick={onClick}
          className="absolute left-0 top-0 w-full h-full z-0"
        ></div>

        <div className="flex items-center gap-5">
          <Checkbox
            checked={data?.doneStatus}
            onChange={(e) => handleChangeTaskStatus()}
          />

          <span className="text-xl">{data?.name}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div>
            {
              data?.taskSubTasksViewModels?.filter((st) => st?.doneStatus)
                ?.length
            }
            /{data?.taskSubTasksViewModels?.length}
          </div>

          <MdOutlineChecklistRtl className="text-gray-500" />
        </div>
      </div>
    </>
  );
}
