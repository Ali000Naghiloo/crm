import { Button } from "antd";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import Task from "./Task";
import { useDroppable } from "@dnd-kit/core";
import TaskModal from "../../../../modals/TaskModal";
import WorkflowModal from "../../../../modals/WorkflowModal";

export default function Workflow({ wf, tasks, boardId, handleGetTasks }) {
  const [showTaskModal, setShowTaskModal] = useState({
    open: false,
    id: null,
    workflowId: null,
  });
  const [showWfModal, setShowWfModal] = useState({
    open: false,
    id: null,
  });

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable ${wf?.id}`,
    data: wf,
  });

  // imports
  // const TaskModal = lazy(() => import("../../../../modals/TaskModal"));
  // const WorkflowModal = lazy(() => import("../../../../modals/WorkflowModal"));

  const onTaskClick = async (id, workFlowId) => {
    setShowTaskModal({ open: true, id: id, workflowId: workFlowId });
  };

  const onWfClick = async (id) => {
    setShowWfModal({ open: true, id: id });
  };

  // wf parts
  const workFlowHeader = () => (
    <div className="w-full sticky top-0 flex flex-col gap-2">
      <div
        className={`w-full min-h-[33px] flex justify-between items-center p-2 rounded-md text-white text-lg text-bold ${
          wf.color ? `bg-[${wf?.color}]` : "bg-accent"
        }`}
      >
        <span>{wf?.name}</span>
        <Button onClick={() => onWfClick(wf?.id)} type="text" className="p-0">
          <MdEdit />
        </Button>
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
        className={`min-w-[300px] h-full overflow-y-auto flex flex-col gap-2 overflow-visible min-h-[700px] rounded-lg ${
          isOver ? "bg-accent" : ""
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
        boardId={boardId}
        getNewList={() => {}}
      />
    </>
  );
}
