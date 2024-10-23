import { useWindowSize } from "@uidotdev/usehooks";
import { Avatar, Checkbox, Drawer, Dropdown, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setSideMenuIsOpen } from "../store/reducers/sideMenu";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { imageUrl } from "../hooks/useHttps";
import LogoutModal from "./LogoutModal";
import useSideMenuItems from "../hooks/useSideMenuItems";

export default function SideMenu() {
  const { pathname } = useLocation();
  const size = useWindowSize();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notifPermission, setNotifPermission] = useState(false);
  let [selectedTabKey, setSelectedTabKey] = useState(pathname);
  let [openMenuChildren, setOpenMenuChildren] = useState();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { items } = useSideMenuItems();

  const openMenu = useSelector((state) => state.sideMenu.isOpen);
  const userData = useSelector((state) => state.userData.userData);

  const profile = [
    {
      key: "1",
      label: <div className="">{userData && userData?.fullName}</div>,
      disabled: true,
    },
    {
      key: "2",
      label: <div>اطلاعات تکمیلی اطلاعات کاربری</div>,
      // disabled: true,
    },
    {
      key: "3",
      danger: true,
      label: <div className="w-full">خروج از حساب کابری</div>,
      onClick: () => setShowLogoutModal(!showLogoutModal),
    },
  ];

  useEffect(() => {
    const paths = pathname?.split("/");

    if (paths) {
      setOpenMenuChildren([`/${paths[1]}`]);
    }
  }, [pathname]);

  const MenuItems = () => {
    return (
      <>
        <Menu
          theme="dark"
          mode={size && size.width > 1000 ? "vertical" : "inline"}
          className="w-full text-base"
          inlineCollapsed={size && size.width > 1000 ? !openMenu : null}
          items={items}
          onClick={handleRouteSwitch}
          defaultSelectedKeys={selectedTabKey}
          // defaultOpenKeys={openMenuChildren}
        />
      </>
    );
  };

  const handleRouteSwitch = (e) => {
    if (e.keyPath[0] && e.keyPath[0] !== "logout") navigate(e.keyPath[0]);
    if (size && size.width < 1000) dispatch(setSideMenuIsOpen(!openMenu));
    setSelectedTabKey(e?.key);
  };

  const UserData = () => (
    <div className="flex items-center mr-5 text-white min-h-header max-h-header">
      {userData && (
        <Dropdown
          menu={{ items: profile }}
          placement="bottom"
          trigger={[size && size?.width < 1000 ? "click" : "hover"]}
        >
          <div className="flex items-center gap-2">
            {userData?.imagePath === imageUrl ? (
              <Avatar
                icon={
                  <FaUserCircle style={{ width: "100%", height: "100%" }} />
                }
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <img
                src={userData?.imagePath}
                alt="پروفایل"
                className="w-8 h-8 rounded-full"
              />
            )}

            <span className="text-nowrap text-sm">
              {size && size.width > 1000
                ? openMenu && userData?.fullName
                : userData?.fullName}
            </span>
          </div>
        </Dropdown>
      )}
    </div>
  );

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
      <div className="w-full flex justify-between mt-24 mb-10 px-5">
        <span>دسترسی ارسال اعلانات </span>
        <Checkbox
          checked={notifPermission}
          onChange={handleTogglePermission}
        ></Checkbox>
      </div>
    );
  };

  // get permission
  useEffect(() => {
    navigator.permissions.query({ name: "notifications" }).then((pr) => {
      if (pr.state === "granted") {
        setNotifPermission(true);
      } else {
        setNotifPermission(false);
      }
    });
  }, []);

  if (size && size.width > 1000) {
    return (
      <>
        <div className="flex flex-col gap-4 text-base overflow-y-auto w-full">
          <UserData />

          <MenuItems />

          {/* {openMenu && <NotifPermissionStatus />} */}
        </div>

        <LogoutModal open={showLogoutModal} setOpen={setShowLogoutModal} />
      </>
    );
  } else {
    return (
      <>
        <Drawer
          closeIcon={
            <CgClose
              className="text-textColor text-base mr-auto"
              size={"2em"}
            />
          }
          title={
            <div className="w-full text-2xl flex items-center ltr">
              <h1>CRM</h1>
            </div>
          }
          open={!openMenu}
          onClose={() => dispatch(setSideMenuIsOpen(!openMenu))}
          className="!bg-backgroundColor !text-textColor text-base"
        >
          <UserData />

          <MenuItems />

          <NotifPermissionStatus />
        </Drawer>

        <LogoutModal open={showLogoutModal} setOpen={setShowLogoutModal} />
      </>
    );
  }
}
