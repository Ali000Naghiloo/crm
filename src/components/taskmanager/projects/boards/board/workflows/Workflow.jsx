import { Button, Popconfirm } from "antd";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Task from "./Task";
import { useDroppable } from "@dnd-kit/core";
import TaskModal from "../../../../modals/TaskModal";
import WorkflowModal from "../../../../modals/WorkflowModal";
import useHttp from "../../../../httpConfig/useHttp";
import { toast } from "react-toastify";

export default function Workflow({
  wf,
  tasks,
  boardId,
  handleGetTasks,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [showTaskModal, setShowTaskModal] = useState({
    open: false,
    id: null,
    workflowId: null,
  });
  const [showWfModal, setShowWfModal] = useState({
    open: false,
    id: null,
    data: null,
  });

  const { setNodeRef, isOver } = useDroppable({
    id: `${wf?.id}`,
    data: wf,
  });

  // imports
  // const TaskModal = lazy(() => import("../../../../modals/TaskModal"));
  // const WorkflowModal = lazy(() => import("../../../../modals/WorkflowModal"));

  const onTaskClick = async (id, workFlowId) => {
    setShowTaskModal({ open: true, id: id, workflowId: workFlowId });
  };

  const onWfClick = async (id, data) => {
    setShowWfModal({ open: true, id: id, data: data });
  };

  const handleDelete = async (id) => {
    const formData = { wfid: id };

    if (tasks?.length == 0) {
      await httpService
        .get("/WorkFlowController/DeleteWorkFlow", { params: formData })
        .then((res) => {
          if (res.status == 200 && res.data?.code == 1) {
            toast.success("با موفقیت حذف شد");
            getNewList();
          }
        })
        .catch(() => {});
    } else {
      toast.info("شما نمیتوانید یک کانبان با وظیفه را حذف کنید");
    }
  };

  // wf parts
  const workFlowHeader = () => (
    <div className="w-full sticky top-0 flex flex-col gap-1 z-50 bg-white">
      <div
        className={`w-full min-h-[33px] flex justify-between items-center p-1 rounded-md text-white text-lg text-bold ${
          wf.color && wf?.color?.length !== 0 ? `` : "bg-accent"
        }`}
        style={wf.color ? { background: wf.color } : {}}
      >
        <span>{wf?.name}</span>

        <div className="flex gap-2">
          <Button
            onClick={() => onWfClick(wf?.id, wf)}
            type="text"
            className="p-0"
          >
            <MdEdit />
          </Button>
          <Popconfirm
            title="آیا میخواهید کانبان را حذف کنید؟"
            okText="بله"
            cancelText="خیر"
            onConfirm={() => handleDelete(wf?.id)}
          >
            <Button type="text" className="p-0">
              <MdDelete />
            </Button>
          </Popconfirm>
        </div>
      </div>
      <Button
        onClick={() =>
          setShowTaskModal({ open: true, workflowId: wf?.id, id: null })
        }
        className="w-full"
      >
        ایجاد وظیفه جدید +
      </Button>
    </div>
  );
  const workflowBody = () => {
    return (
      <>
        {tasks &&
          tasks.map((task, index) => (
            <Task
              key={index}
              data={task}
              onClick={() => onTaskClick(task.id, task?.workFlow)}
              getNewList={handleGetTasks}
            />
          ))}
      </>
    );
  };

  useEffect(() => {}, [wf]);

  return (
    <>
      <div
        ref={setNodeRef}
        className={`w-[300px] h-full flex flex-col gap-2 rounded-lg ${
          isOver ? "bg-[rgba(204,204,204,0.5)]" : ""
        }`}
      >
        {workFlowHeader()}
        {tasks && workflowBody()}
      </div>

      <TaskModal
        open={showTaskModal.open}
        setOpen={(e) => setShowTaskModal({ open: e })}
        workflowId={showTaskModal.workflowId}
        id={showTaskModal.id}
        boardId={boardId}
        getNewList={handleGetTasks}
      />
      <WorkflowModal
        open={showWfModal.open}
        setOpen={(e) => setShowWfModal({ open: e })}
        id={showWfModal.id}
        data={showWfModal.data}
        boardId={boardId}
        getNewList={getNewList}
      />
    </>
  );
}
