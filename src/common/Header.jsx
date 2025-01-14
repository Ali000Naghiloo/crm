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
import { useWindowSize } from "@uidotdev/usehooks";
import { setAllEnum } from "../store/reducers/enumReducer";
import logo from "../assets/images/logo.svg";

export default function AppHeader() {
  // const { httpService } = useHttp();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const size = useWindowSize();
  const token = localStorage.getItem("token");
  const sideMenu = useSelector((state) => state.sideMenu.isOpen);
  const userRole = useSelector((state) => state.userData.userRole);

  const handleToggleSideMenu = () => {
    dispatch(setSideMenuIsOpen(!sideMenu));
  };

  if (window.location.pathname !== "/login" && token && userRole) {
    return (
      <>
        <div className="relative flex items-center top-0 w-full h-full min-h-header max-h-header text-white rounded-ee-lg shadow-md z-10">
          <div className="flex justify-between items-center w-full h-full max-h-[100%] px-2 md:px-5">
            <div className="flex gap-3 items-center">
              <Button
                onClick={handleToggleSideMenu}
                className="p-0 text-white"
                type="text"
              >
                {sideMenu ? (
                  <RiMenuUnfoldLine size={"2em"} />
                ) : (
                  <RiMenuFoldLine size={"2em"} />
                )}
              </Button>
            </div>

            <div className="h-full w-fit flex flex-col items-center justify-center absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
              <h1 className="font-bold text-xl">CRM گرانتیل</h1>
              <div className="w-[70px]">
                <img src={logo} alt="logo" className="w-full" />
              </div>
            </div>

            <div className="flex justify-end items-center gap-2 h-full">
              {/* <ThemeButton /> */}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="min-h-header max-h-header bg-backgroundColor z-0"></div>
    );
  }
}
