import { Checkbox, Tag } from "antd";
import moment from "jalali-moment";
import { useState } from "react";

export default function Task({ data, onClick }) {
  const [loading, setLoading] = useState(false);

  const handleChangeTaskStatus = async (e) => {};
  const handleChangeSubTaskStatus = async (e) => {};

  return (
    <>
      <div
        onClick={onClick}
        className={`w-full flex flex-col gap-3 max-h-[275px] hover:bg-gray-100 cursor-pointer p-2 rounded-md  bg-[#e6e8ec] ${
          data?.isDelayed ? "border-red-500 border-4" : ""
        }`}
      >
        {/* first view */}
        <div className="flex gap-2">
          <Checkbox
            checked={data?.doneStatus}
            onClick={(e) => handleChangeTaskStatus(e.target?.checked)}
          />
          <span className="text-lg">{data?.name}</span>
        </div>

        {/* reminder */}
        {data?.remainderDateTime ? (
          <Tag color="cyan-inverse" className="w-fit flex gap-1 text-sm">
            <span>یادآوری : </span>
            <span>
              {moment.utc(data?.remainderDateTime).locale("fa").format("dddd")}
            </span>
            <span>
              {moment.utc(data?.remainderDateTime).locale("fa").format("DD")}
            </span>
            <span>
              {moment.utc(data?.remainderDateTime).locale("fa").format("MMMM")}
            </span>
            -
            <span>
              {moment.utc(data?.remainderDateTime).locale("fa").format("HH:mm")}
            </span>
          </Tag>
        ) : null}

        {/* descriptions */}
        <div className="w-full text-lg">{data?.description}</div>

        {/* subtasks */}
        {data?.taskSubTasksViewModels &&
        data?.taskSubTasksViewModels?.length !== 0 ? (
          <div className="w-full flex flex-col border-2 border-gray-300 rounded-lg max-h-[65px] p-4 overflow-y-auto">
            {data?.taskSubTasksViewModels?.map((sub, index) => (
              <div
                key={index}
                className="w-full flex justify-between border-y-[#e1e1e1] border-y-2"
              >
                <div className="border-l-2 border-l-gray-500 p-3">
                  <Checkbox
                    checked={sub.doneStatus}
                    onClick={(e) =>
                      handleChangeSubTaskStatus(e.target?.checked)
                    }
                  />
                </div>
                <span className="w-full">{sub?.name}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
