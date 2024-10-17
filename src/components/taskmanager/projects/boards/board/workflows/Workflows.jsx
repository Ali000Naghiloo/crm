import React, { useEffect, useState } from "react";
import useHttp from "../../../../httpConfig/useHttp";
import { Skeleton } from "antd";

export default function Workflows({ boardId, workflows }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(true);
  const [workflowList, setWorkflowList] = useState(null);
  const [taskList, setTaskList] = useState(null);

  const handleGetTasks = async () => {
    setLoading(true);
    const formData = {
      boardId: boardId,
    };

    await httpService
      .get("/TaskController/Tasks", { params: formData })
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          setTaskList(res.data?.data);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  // wf parts
  const workFlowHeader = (wf) => (
    <div
      className={`w-full min-h-[33px] flex items-center p-2 rounded-md text-white text-lg text-bold sticky top-0 ${
        wf.color ? `bg-[${wf?.color}]` : "bg-accent"
      }`}
    >
      {wf?.name}
    </div>
  );
  const workflowBody = (wf) => {
    let filteredTasks =
      taskList && taskList?.length
        ? taskList.filter((task) => wf?.id == task?.workFlow)
        : [];

    return (
      <>
        {filteredTasks &&
          filteredTasks.map((task, index) => (
            <div key={index} className="w-full max-h-[275px]">
              {task?.name}
            </div>
          ))}
      </>
    );
  };

  useEffect(() => {
    if (workflows) setWorkflowList(workflows);
  }, [workflows]);

  useEffect(() => {
    if (boardId) handleGetTasks();
  }, [boardId]);

  return (
    <>
      <div className="h-full overflow-x-auto flex gap-4 pr-5">
        {workflowList && taskList ? (
          workflowList?.length !== 0 ? (
            workflowList.map((wf) => (
              <div
                key={wf.id}
                className="w-[300px] overflow-y-auto flex flex-col gap-2 relative"
              >
                {workFlowHeader(wf)}
                {taskList && workflowBody(wf)}
              </div>
            ))
          ) : null
        ) : (
          <Skeleton.Node style={{ width: "270px", height: "33px" }} />
        )}

        {/* add new workflow */}
        <div className="max-h-pagesHeight overflow-x-auto flex gap-4">
          <div
            className={`w-[300px] min-h-[30px] h-fit text-center p-2 rounded-md text-white text-lg text-bold cursor-pointer bg-gray-700 hover:bg-gray-500`}
          >
            افزودن کانبان جدید +
          </div>
        </div>
      </div>
    </>
  );
}
