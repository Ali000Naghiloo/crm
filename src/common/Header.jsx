import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setUserRole } from "../store/reducers/userDataReducer";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { setSideMenuIsOpen } from "../store/reducers/sideMenu";
import { ThemeButton } from "../assets/icons/ThemButton";
import useHttp, { imageUrl } from "../hooks/useHttps";
import { toast } from "react-toastify";
import LogoutModal from "./LogoutModal";
import { useWindowSize } from "@uidotdev/usehooks";
import { setAllEnum } from "../store/reducers/enumReducer";

export default function AppHeader() {
  const { httpService } = useHttp();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const size = useWindowSize();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const token = localStorage.getItem("token");
  const sideMenu = useSelector((state) => state.sideMenu.isOpen);
  const userRole = useSelector((state) => state.userData.userRole);

  const handleGetUserData = () => {
    httpService
      .get("Account/UserDetailsByToken")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          if (res.data?.data.isAdmin === 1) {
            dispatch(setUserRole("admin"));
          } else {
            dispatch(setUserRole("user"));
          }
          dispatch(setUserData(res.data.data));
        } else {
          toast.warn(res.data.msg);
          navigate("/login");
        }
      })
      .catch(() => {
        setTimeout(() => {
          handleGetUserData();
        }, 10000);
      });
  };

  const handleGetEnum = () => {
    httpService
      .get("Enum/AllEnums")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          dispatch(setAllEnum(res.data.data));
        } else {
          // toast(res.data.msg);
        }
      })
      .catch(() => {});
  };

  const handleToggleSideMenu = () => {
    dispatch(setSideMenuIsOpen(!sideMenu));
  };

  useEffect(() => {
    // get project enums
    handleGetEnum();

    if (token) {
      // dispatch(setUserRole("user"));
      handleGetUserData();
    } else {
      navigate("/login");
    }
  }, []);

  if (window.location.pathname !== "/login" && token && userRole) {
    return (
      <>
        <div className="sticky flex items-center top-0 w-full h-full min-h-header max-h-header bg-backgroundColor text-textColor rounded-ee-lg shadow-md z-10">
          <div className="flex justify-between items-center w-full h-full max-h-[100%] px-2 md:px-5">
            <div className="flex gap-3 items-center">
              <Button
                onClick={handleToggleSideMenu}
                className="p-0 text-textColor"
                type="text"
              >
                {sideMenu ? (
                  <RiMenuUnfoldLine size={"2em"} />
                ) : (
                  <RiMenuFoldLine size={"2em"} />
                )}
              </Button>
            </div>

            {/* current tab name */}
            <div className="h-full flex flex-col items-center">
              <h1 className="font-bold text-xl">CRM گرانتیل</h1>
            </div>

            <div className="flex justify-end items-center gap-2 h-full">
              <ThemeButton />
            </div>
          </div>
        </div>

        <LogoutModal open={showLogoutModal} setOpen={setShowLogoutModal} />
      </>
    );
  }
}
