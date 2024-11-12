import { useDraggable } from "@dnd-kit/core";
import { Button, Checkbox, Popconfirm, Spin, Tag } from "antd";
import moment from "jalali-moment";
import { useState } from "react";
import { RxDragHandleDots1 } from "react-icons/rx";
import useHttp from "../../../../httpConfig/useHttp";
import { MdDelete, MdEdit } from "react-icons/md";

export default function Task({ data, onClick, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: data?.id,
    data: data,
  });
  const draggableStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: "10",
      }
    : undefined;

  const handleChangeTaskStatus = async (e) => {
    setLoading(true);
    const formData = {
      taskid: data?.id,
    };

    await httpService
      .get("/TaskController/TaskDoneStatus", { params: formData })
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };
  const handleChangeSubTaskStatus = async (e) => {};

  return (
    <>
      <div
        className={`w-full min-h-[fit-content] overflow-y-auto relative flex flex-col bg-[#e6e8ec] cursor-pointer gap-3 pt-5 p-2 rounded-md  border-2 border-gray-300 shadow ${
          data?.isDelayed ? "border-red-500 border-4" : ""
        }`}
      >
        {/* open task data */}
        <div
          onClick={onClick}
          className="w-full h-full absolute top-0 left-0 z-0"
        ></div>

        {/* manage task */}
        <div className="flex flex-row-reverse absolute left-0 top-0 z-[1]">
          <div className="flex gap-1">
            <Button onClick={onClick} type="text" className="p-1 h-fit">
              <MdEdit />
            </Button>
            <Popconfirm
              title="آیا میخواهید وظیفه را حذف کنید؟"
              okText="بله"
              cancelText="خیر"
              // onConfirm={() => handleDelete(wf?.id)}
            >
              <Button type="text" className="p-1 h-fit">
                <MdDelete />
              </Button>
            </Popconfirm>
          </div>
        </div>

        {/* draggable */}
        <div
          {...attributes}
          {...listeners}
          ref={setNodeRef}
          style={draggableStyle}
          className="w-full h-[20px] flex justify-center cursor-pointer items-center absolute top-0 left-0 z-0 hover:bg-[rgba(44,44,44,0.2)]"
        >
          <RxDragHandleDots1 className="rotate-90" />
        </div>

        <div className="w-full flex flex-col gap-1 z-10">
          {/* first view */}
          <div className="w-fit flex gap-2">
            {!loading ? (
              <Checkbox
                checked={data?.doneStatus}
                onClick={(e) => handleChangeTaskStatus(e.target?.checked)}
              />
            ) : (
              <Spin />
            )}
            <span className="text-lg">{data?.name}</span>
          </div>

          {/* reminder */}
          {data?.remainderDateTime ? (
            <Tag color="cyan-inverse" className="w-fit flex gap-1 text-sm">
              <span>یادآوری : </span>
              <span>
                {moment
                  .utc(data?.remainderDateTime)
                  .locale("fa")
                  .format("dddd")}
              </span>
              <span>
                {moment.utc(data?.remainderDateTime).locale("fa").format("DD")}
              </span>
              <span>
                {moment
                  .utc(data?.remainderDateTime)
                  .locale("fa")
                  .format("MMMM")}
              </span>
              -
              <span>
                {moment
                  .utc(data?.remainderDateTime)
                  .locale("fa")
                  .format("HH:mm")}
              </span>
            </Tag>
          ) : null}

          {/* descriptions */}
          {data?.description && (
            <div className="w-full bg-white rounded p-1 text-sm">
              <span className="text-wrap">{data?.description}</span>
            </div>
          )}

          {/* subtasks */}
          {data?.taskSubTasksViewModels &&
          data?.taskSubTasksViewModels?.length !== 0 ? (
            <div className="w-full h-[120px] flex flex-col border border-[gray] rounded-lg overflow-y-auto">
              {data?.taskSubTasksViewModels?.map((sub, index) => (
                <div
                  key={index}
                  className="w-full flex gap-2 items-center justify-between border-y-[#e1e1e1] border-y-2"
                >
                  <div className="border-l-2 border-l-gray-500 p-1">
                    <Checkbox checked={sub.doneStatus} />
                  </div>
                  <span className="w-full">{sub?.name}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
