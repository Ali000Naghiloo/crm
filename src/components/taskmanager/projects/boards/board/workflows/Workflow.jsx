import { Button } from "antd";
import React, { lazy, useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import Task from "./Task";
import { useDroppable } from "@dnd-kit/core";

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

  const { attributes, listeners, setNodeRef, transform } = useDroppable({
    id: `droppable ${wf?.id}`,
    data: wf,
  });
  const droppableStyle = {};

  // imports
  const TaskModal = lazy(() => import("../../../../modals/TaskModal"));
  const WorkflowModal = lazy(() => import("../../../../modals/WorkflowModal"));

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
    let filteredTasks = tasks && tasks?.length !== 0 ? tasks : [];

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
    console.log(wf);
  }, [wf]);

  return (
    <>
      <div
        // ref={setNodeRef}
        // style={droppableStyle}
        // {...attributes}
        // {...listeners}
        className="min-w-[300px] h-full overflow-y-auto flex flex-col gap-2 relative bg-red-500"
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
