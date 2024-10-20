import React, { lazy, useEffect, useState } from "react";
import useHttp from "../../../../httpConfig/useHttp";
import { Button, Skeleton } from "antd";
import Task from "./Task";
import { Suspense } from "react";

export default function Workflows({ boardId, workflows }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(true);
  const [workflowList, setWorkflowList] = useState(null);
  const [taskList, setTaskList] = useState(null);
  const [showModal, setShowModal] = useState({
    open: false,
    id: null,
    workflowId: null,
  });
  const [showTaskModal, setShowTaskModal] = useState({
    open: false,
    id: null,
    workflowId: null,
  });

  // imports
  const TaskModal = lazy(() => import("../../../../modals/TaskModal"));

  const handleGetTasks = async () => {
    setLoading(true);
    let datas = [];
    const formData = {
      boardId: boardId,
    };

    await httpService
      .get("/TaskController/Tasks", { params: formData })
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          datas = res.data?.data;
        }
      })
      .catch(() => {});

    setTaskList(datas);
    setLoading(false);
  };

  const onTaskClick = async (id, workFlowId) => {
    setShowModal({ open: true, id: id, workflowId: workFlowId });
  };

  // wf parts
  const workFlowHeader = (wf) => (
    <div className="w-full sticky top-0 flex flex-col gap-2">
      <div
        className={`w-full min-h-[33px] flex items-center p-2 rounded-md text-white text-lg text-bold ${
          wf.color ? `bg-[${wf?.color}]` : "bg-accent"
        }`}
      >
        {wf?.name}
      </div>
      <Button
        onClick={() =>
          setShowModal({ open: true, workflowId: wf?.id, id: null })
        }
        className="w-full"
      >
        ایجاد وظیفه جدید +
      </Button>
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
            <Task
              key={index}
              data={task}
              onClick={() => onTaskClick(task.id, task?.workFlow)}
            />
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
    <Suspense fallback={<></>}>
      <div className="w-ful h-full overflow-x-auto flex gap-4 p-5">
        {workflowList && taskList ? (
          workflowList?.length !== 0 ? (
            workflowList.map((wf) => (
              <div
                key={wf.id}
                className="w-[300px] max-h-[100%] overflow-y-auto flex flex-col gap-2 relative"
              >
                {workFlowHeader(wf)}
                {taskList && workflowBody(wf)}
              </div>
            ))
          ) : null
        ) : (
          <>
            <Skeleton.Node style={{ width: "270px", height: "33px" }} />
            <Skeleton.Node style={{ width: "270px", height: "33px" }} />
            <Skeleton.Node style={{ width: "270px", height: "33px" }} />
            <Skeleton.Node style={{ width: "270px", height: "33px" }} />
          </>
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

      <TaskModal
        open={showModal.open}
        setOpen={(e) => setShowModal({ open: e })}
        workflowId={showModal.workflowId}
        id={showModal.id}
        boardId={boardId}
        getNewList={handleGetTasks}
      />
    </Suspense>
  );
}
