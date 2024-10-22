import { useWindowSize } from "@uidotdev/usehooks";
import { Avatar, Checkbox, Drawer, Dropdown, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setSideMenuIsOpen } from "../store/reducers/sideMenu";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { setPageRoutes } from "../store/reducers/pageRoutes";
import { BsFillBagCheckFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { MdFactCheck, MdPriceChange } from "react-icons/md";
import { GoDot } from "react-icons/go";
import { AiFillProduct } from "react-icons/ai";
import { FaUserCircle, FaWarehouse } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { HiDocumentReport } from "react-icons/hi";
import { BsChatLeftTextFill } from "react-icons/bs";
import { MdManageSearch } from "react-icons/md";
import { GoProjectSymlink } from "react-icons/go";
import logo from "../assets/images/logo.svg";
import { imageUrl } from "../hooks/useHttps";

export default function SideMenu() {
  const { pathname } = useLocation();
  const size = useWindowSize();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notifPermission, setNotifPermission] = useState(false);
  let [selectedTabKey, setSelectedTabKey] = useState(pathname);
  let [openMenuChildren, setOpenMenuChildren] = useState();

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

  const menuItems = [
    {
      key: "/",
      icon: <TbLayoutDashboardFilled size={"1.5em"} className="" />,
      label: "داشبورد",
    },
    {
      key: "/customers",
      icon: <BsFillBagCheckFill size={"1.5em"} className="" />,
      label: "اشخاص",
      children: [
        {
          key: "/customers",
          icon: <GoDot size={"1em"} className="" />,
          label: "فهرست",
        },
        {
          key: "/customers/roles",
          icon: <GoDot size={"1em"} className="" />,
          label: "نقش",
        },
        {
          key: "/customers/groups",
          icon: <GoDot size={"1em"} className="" />,
          label: "گروه",
        },
      ],
    },
    {
      key: "/prices",
      icon: <MdPriceChange size={"1.5em"} className="" />,
      label: "قیمت ها",
      children: [
        {
          key: "/prices",
          icon: <GoDot size={"1em"} className="" />,
          label: "فهرست",
        },
        {
          key: "/prices/groups",
          icon: <GoDot size={"1em"} className="" />,
          label: "گروه قیمت گذاری",
        },
      ],
    },
    {
      key: "/commissions",
      icon: <MdPriceChange size={"1.5em"} className="" />,
      label: "پورسانت ها",
      children: [
        {
          key: "/commissions",
          icon: <GoDot size={"1em"} className="" />,
          label: "فهرست",
        },
      ],
    },
    {
      key: "/products",
      icon: <AiFillProduct size={"1.5em"} className="" />,
      label: "کالا و خدمات",
      children: [
        {
          key: "/products",
          icon: <GoDot size={"1em"} className="" />,
          label: "فهرست",
        },
        {
          key: "/products/categories",
          icon: <GoDot size={"1em"} className="" />,
          label: "دسته بندی",
        },
        {
          key: "/products/creators",
          icon: <GoDot size={"1em"} className="" />,
          label: "تامین کنندگان کالا و خدمات",
        },
      ],
    },
    {
      key: "/conditions",
      icon: <FaListCheck size={"1.5em"} className="" />,
      label: "اضافات و کسورات",
      children: [
        {
          key: "/conditions",
          icon: <GoDot size={"1em"} className="" />,
          label: "فهرست",
        },
      ],
    },
    {
      key: "/factors",
      icon: <MdFactCheck size={"1.5em"} className="" />,
      label: "فاکتور ها",
      children: [
        {
          key: "/factors/preFactors",
          icon: <GoDot size={"1em"} className="" />,
          label: "پیش فاکتور",
        },
        {
          key: "/factors/sell-factors",
          icon: <GoDot size={"1em"} className="" />,
          label: "فاکتور فروش",
        },
        {
          key: "/factors/sell-rejected",
          icon: <GoDot size={"1em"} className="" />,
          label: "فاکتور برگشت از فروش",
        },
        {
          key: "/factors/but-factors",
          icon: <GoDot size={"1em"} className="" />,
          label: "فاکتور خرید",
        },
        {
          key: "/factors/buy-rejected",
          icon: <GoDot size={"1em"} className="" />,
          label: "فاکتور برگشت از خرید",
        },
      ],
    },
    {
      key: "/requests",
      icon: <MdFactCheck size={"1.5em"} className="" />,
      label: "درخواست ها",
      children: [
        {
          key: "/requests/initial-request",
          icon: <GoDot size={"1em"} className="" />,
          label: "درخواست کالا",
        },
        {
          key: "/requests/request",
          icon: <GoDot size={"1em"} className="" />,
          label: "درخواست همکاری",
        },
      ],
    },
    {
      key: "/reports",
      icon: <HiDocumentReport size={"1.5em"} className="" />,
      label: "گزارشات",
      children: [
        {
          key: "/reports/factors",
          icon: <GoDot size={"1em"} className="" />,
          label: "گزارش فاکتور ها",
        },
      ],
    },
    {
      key: "/warehouses",
      icon: <FaWarehouse size={"1.5em"} className="" />,
      label: "انبار ها",
      children: [
        {
          key: "/warehouses",
          icon: <GoDot size={"1em"} className="" />,
          label: "فهرست انبار ها",
        },
      ],
    },
    {
      key: "/taskmanager",
      icon: <MdManageSearch size={"1.7em"} className="" />,
      label: "مدیریت پروژه",
      children: [
        {
          key: "/taskmanager/chat",
          icon: <GoDot size={"1em"} className="" />,
          label: "گفتگو",
        },
        {
          key: "/taskmanager/projects",
          icon: <GoDot size={"1em"} className="" />,
          label: "پروژه ها",
        },
        {
          key: "/taskmanager/my-tasks",
          icon: <GoDot size={"1em"} className="" />,
          label: "وظیفه ها",
        },
        {
          key: "/taskmanager/create-note",
          icon: <GoDot size={"1em"} className="" />,
          label: "یادداشت های من",
        },
      ],
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
          theme="dark"
          mode="vertical"
          className="w-full text-base"
          // style={{ border: "none" }}
          inlineCollapsed={!isOpen}
          items={menuItems}
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
    <div className="flex items-center mr-5 text-white">
      <Dropdown
        menu={{ items: profile }}
        placement="bottom"
        trigger={[size && size?.width < 1000 ? "click" : "hover"]}
      >
        <div className="flex items-center gap-2">
          {userData?.imagePath && userData?.imagePath === imageUrl ? (
            <Avatar
              icon={<FaUserCircle style={{ width: "100%", height: "100%" }} />}
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
            {userData && size && size.width > 1000 && userData?.fullName}
          </span>
        </div>
      </Dropdown>
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

  useEffect(() => {
    console.log(size.width);
  }, [size]);

  return (
    <>
      {/* stick to top equal to header height */}
      <div
        className={`flex flex-col gap-4 text-base top-[80px] overflow-y-auto mt-3`}
      >
        <UserData />

        <MenuItems isOpen={openMenu} />

        {/* {openMenu && <NotifPermissionStatus />} */}
      </div>
    </>
  );
  // return (
  //   <>
  //     <Drawer
  //       closeIcon={
  //         <CgClose
  //           className="text-textColor text-base mr-auto"
  //           size={"2em"}
  //         />
  //       }
  //       title={
  //         <div className="w-full text-2xl flex items-center ltr">
  //           <h1>CRM</h1>
  //         </div>
  //       }
  //       open={!openMenu}
  //       onClose={() => dispatch(setSideMenuIsOpen(!openMenu))}
  //       className="!bg-backgroundColor !text-textColor text-base"
  //     >
  //       <MenuItems isOpen={!openMenu} />

  //       <NotifPermissionStatus />
  //     </Drawer>
  //   </>
  // );
}
