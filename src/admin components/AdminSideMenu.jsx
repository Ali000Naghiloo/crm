import { useWindowSize } from "@uidotdev/usehooks";
import { Checkbox, Drawer, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setSideMenuIsOpen } from "../store/reducers/sideMenu";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { setPageRoutes } from "../store/reducers/pageRoutes";
import { IoPersonSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { MdFactCheck } from "react-icons/md";

export default function SideMenu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const size = useWindowSize();
  const dispatch = useDispatch();
  const openMenu = useSelector((state) => state.sideMenu.isOpen);
  const [notifPermission, setNotifPermission] = useState(false);
  let [selectedTabKey, setSelectedTaqbKey] = useState(pathname);
  let [openMenuChildren, setOpenMenuChildren] = useState();

  const menuItems = [
    {
      key: "/",
      icon: (
        <TbLayoutDashboardFilled size={"1.5em"} className="!text-textColor" />
      ),
      label: (
        <div
          onClick={() =>
            handleAddToPageNames([{ label: "داشبورد" }, { label: "اطلاعات" }])
          }
          className="text-textColor flex items-center"
        >
          داشبورد
        </div>
      ),
    },
    {
      key: "/employees",
      icon: <IoPersonSharp size={"1.5em"} className="!text-textColor" />,
      label: (
        <div
          onClick={() =>
            handleAddToPageNames([
              { label: "کارمندان" },
              { label: "لیست کارمندان" },
            ])
          }
          className="text-textColor flex items-center"
        >
          کارمندان
        </div>
      ),
    },
    {
      key: "/factor-settings",
      icon: <MdFactCheck size={"1.5em"} className="!text-textColor" />,
      label: (
        <div
          onClick={() =>
            handleAddToPageNames([
              { label: "فاکتور ها" },
              { label: "تنظیمات فاکتور" },
            ])
          }
          className="text-textColor flex items-center"
        >
          تنظیمات فاکتور
        </div>
      ),
    },
  ];

  const handleAddToPageNames = (value) => {
    dispatch(setPageRoutes(value));
  };

  useEffect(() => {
    const paths = pathname?.split("/");

    if (paths) {
      setOpenMenuChildren([`/${paths[1]}`]);
    }
  }, [pathname]);

  const MenuItems = ({ isOpen }) => {
    return (
      <>
        <Menu
          mode="inline"
          className="w-full max-w-[100%] text-lg mt-5 !bg-backgroundColor !text-textColor "
          style={{ border: "none" }}
          inlineCollapsed={!isOpen}
          items={menuItems}
          onClick={handleRouteSwitch}
          defaultSelectedKeys={selectedTabKey}
          defaultOpenKeys={openMenuChildren}
        />
      </>
    );
  };

  const handleRouteSwitch = (e) => {
    if (e.keyPath[0] && e.keyPath[0] !== "logout") navigate(e.keyPath[0]);
    if (size && size.width < 1000) dispatch(setSideMenuIsOpen(!openMenu));
    setSelectedTaqbKey(e?.key);
  };

  // notification permission changes
  const handleGetPermission = () => {
    Notification.requestPermission().then((res) => {
      if (res === "granted") {
        setNotifPermission(true);
      } else {
        setNotifPermission(false);
        handleGetPermission();
      }
    });
  };
  const handleTogglePermission = () => {
    navigator.permissions.query({ name: "notifications" }).then((pr) => {
      if (pr.state === "granted") {
        setNotifPermission(true);
      } else {
        handleGetPermission();
      }
    });
  };

  const NotifPermissionStatus = () => {
    return (
      <div className="w-full flex justify-between text-lg mt-24">
        <span>دسترسی ارسال اعلانات </span>
        <Checkbox
          checked={notifPermission}
          onChange={handleTogglePermission}
        ></Checkbox>
      </div>
    );
  };

  useEffect(() => {
    navigator.permissions.query({ name: "notifications" }).then((pr) => {
      if (pr.state === "granted") {
        setNotifPermission(true);
      } else {
        setNotifPermission(false);
      }
    });
  }, []);

  useEffect(() => {
    const paths = pathname?.split("/");

    if (paths) {
      setOpenMenuChildren([`/${paths[1]}`]);
    }
  }, [pathname]);

  if (size && size.width > 1000) {
    return (
      <>
        {/* stick to top equal to header height */}
        <div
          className={`${
            openMenu ? "min-w-sideBarWidth" : "min-w-[70px]"
          } sticky flex flex-col bg-backgroundColor text-textColor top-[80px] max-h-pagesHeight px-5 overflow-y-auto transition-all shadow-md min-h-pagesHeight z-10`}
        >
          <MenuItems isOpen={openMenu} />

          {openMenu && <NotifPermissionStatus />}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="">
          <Drawer
            closeIcon={
              <CgClose className="text-textColor mr-auto" size={"2em"} />
            }
            title={
              <div className="w-full text-2xl flex items-center ltr">
                <h1>CRM</h1>
              </div>
            }
            open={!openMenu}
            onClose={() => dispatch(setSideMenuIsOpen(!openMenu))}
            className="!bg-backgroundColor !text-textColor"
          >
            <MenuItems isOpen={!openMenu} />

            <NotifPermissionStatus />
          </Drawer>
        </div>
      </>
    );
  }
}
