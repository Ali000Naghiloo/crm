import { Modal } from "antd";
import CreateLimit from "./CreateLimit";

export default function CreateLimitModal({ open, setOpen, conditionId }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onCancel={handleClose} className="w-full min-w-[900px]">
      <CreateLimit limitId={null} conditionId={conditionId} />
    </Modal>
  );
}
