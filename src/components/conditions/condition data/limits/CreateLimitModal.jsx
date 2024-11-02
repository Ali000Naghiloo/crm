import { Modal } from "antd";
import CreateLimit from "./CreateLimit";
import { useEffect } from "react";

export default function CreateLimitModal({
  open,
  setOpen,
  conditionId,
  getNewList,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleGetData = async () => {};

  useEffect(() => {
    if (conditionId) handleGetData();
  }, [conditionId]);

  return (
    <Modal open={open} onCancel={handleClose} className="w-full min-w-[900px]">
      <CreateLimit
        limitId={null}
        conditionId={conditionId}
        handleClose={handleClose}
        getNewList={getNewList}
      />
    </Modal>
  );
}
