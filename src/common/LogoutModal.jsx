import { Modal } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUserRole } from "../store/reducers/userDataReducer";
import { useCookies } from "react-cookie";

export default function LogoutModal({ open, setOpen }) {
  // const [cookies, setCookie, removeCookie] = useCookies(["Authorization"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    navigate("/login");
    dispatch(setUserRole(null));
    toast.success("با موفقیت خارج شدید");
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="آیا می خواهید از حساب کاربری خود خارج شوید؟"
        centered
        open={open}
        onClose={setOpen}
        onOk={handleLogout}
        onCancel={() => setOpen(false)}
        okButtonProps={{ disabled: loading, danger: true }}
        cancelButtonProps={{ disabled: loading }}
        okText="خروج"
        cancelText="لغو"
      ></Modal>
    </>
  );
}
