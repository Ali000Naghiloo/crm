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
      className={`w-full min-h-[30px] p-2 rounded-md text-white text-lg text-bold ${
        wf.color ? `bg-[${wf?.color}]` : "bg-accent"
      }`}
    >
      {wf?.name}
    </div>
  );
  const workflowBody = (wf) => {
    if (taskList) {
      if (taskList?.length !== 0) {
        taskList.map((task) => {
          if (wf?.id == task?.workFlow) {
            return <div className="w-full">{task?.name}</div>;
          }
        });
      } else {
        return <></>;
      }
    } else {
      return <Skeleton.Node style={{ width: "100%", height: "100%" }} />;
    }
  };

  useEffect(() => {
    if (workflows) setWorkflowList(workflows);
  }, [workflows]);

  useEffect(() => {
    if (boardId) handleGetTasks();
  }, [boardId]);

  return (
    <>
      <div className="max-h-pagesHeight overflow-x-auto flex gap-4">
        {workflowList ? (
          workflowList?.length !== 0 ? (
            workflowList.map((wf) => (
              <div
                key={wf.id}
                className="w-[300px] h-full overflow-y-aut flex flex-col gap-2"
              >
                {workFlowHeader(wf)}
                {workflowBody(wf)}
              </div>
            ))
          ) : null
        ) : (
          <Skeleton.Node style={{ width: "270px", height: "33px" }} />
        )}
      </div>
    </>
  );
}
