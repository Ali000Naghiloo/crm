import React, { lazy, useEffect, useState } from "react";
import useHttp from "../../../../httpConfig/useHttp";
import { Button, Skeleton } from "antd";
import { Suspense } from "react";
import Workflow from "./Workflow";
import { closestCenter, DndContext } from "@dnd-kit/core";

export default function Workflows({ boardId, workflows, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(true);
  const [workflowList, setWorkflowList] = useState(null);
  const [taskList, setTaskList] = useState(null);
  const [showWfModal, setShowWfModal] = useState({
    open: false,
    id: null,
    boardId: null,
  });

  const WorkflowModal = lazy(() => import("../../../../modals/WorkflowModal"));

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

  const onWfClick = async (id) => {
    setShowWfModal({ open: true, id: id, boardId: boardId });
  };

  const onNewWfClick = () => {
    setShowWfModal({ open: true, id: id, boardId: boardId });
  };

  const handleDragTask = async (e) => {
    console.log(e);
    const taskId = e?.active?.id;
    const wfId = e?.over?.id;

    const formData = {
      taskId: taskId,
      newWorkFlowId: wfId,
    };

    if (taskId && wfId) {
      await httpService
        .post("/TaskController/ChangeTaskWorkFlow", formData)
        .then((res) => {
          if (res.status == 200 && res.data?.code == 1) {
            handleGetTasks();
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (workflows) setWorkflowList(workflows);
  }, [workflows]);

  useEffect(() => {
    if (boardId) handleGetTasks();
  }, [boardId]);

  return (
    <Suspense>
      <div className="w-full h-full bg-[#e6e8ec] overflow-auto flex gap-4 p-5">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragTask}
        >
          {workflowList ? (
            workflowList?.length !== 0 ? (
              workflowList.map((wf, index) => (
                <Workflow
                  key={index}
                  wf={wf}
                  tasks={
                    taskList
                      ? taskList.filter((task) => wf?.id == task?.workFlow)
                      : []
                  }
                  boardId={boardId}
                  handleGetTasks={handleGetTasks}
                  getNewList={getNewList}
                />
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
          <div className="min-w-[300px] h-full overflow-x-auto flex gap-4">
            <div
              onClick={() => onWfClick(null)}
              className={`w-full min-h-[30px] h-fit text-center p-2 rounded-md text-white text-lg text-bold cursor-pointer bg-gray-700 hover:bg-gray-500`}
            >
              افزودن کانبان جدید +
            </div>
          </div>
        </DndContext>
      </div>

      <WorkflowModal
        open={showWfModal.open}
        setOpen={(e) => setShowWfModal({ open: e })}
        id={showWfModal.id}
        boardId={showWfModal.boardId}
        getNewList={getNewList}
      />
    </Suspense>
  );
}
