import { Checkbox } from "antd";
import React, { useState } from "react";
import useHttp from "../../../../httpConfig/useHttp";
import { toast } from "react-toastify";

export default function Task({ data, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  const handleChangeTaskStatus = async (e) => {
    setLoading(true);

    await httpService
      .get("/TaskController/TaskDoneStatus")
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
      <div className="w-full flex justify-between items-center rounded-lg bg-white p-5 cursor-pointer hover:bg-gray-100">
        <div className="flex items-center gap-5">
          <Checkbox
            checked={data?.doneStatus}
            onChange={(e) => handleChangeTaskStatus(e.target?.checked)}
          />

          <span className="text-xl">{data?.name}</span>
        </div>
      </div>
    </>
  );
}