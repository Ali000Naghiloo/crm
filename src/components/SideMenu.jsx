import { useWindowSize } from "@uidotdev/usehooks";
import { Checkbox, Drawer, Menu } from "antd";
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
import { FaWarehouse } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";

export default function SideMenu() {
  const { pathname } = useLocation();
  const size = useWindowSize();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      label: <div className="text-textColor flex items-center">داشبورد</div>,
    },
    {
      key: "/customers",
      icon: <BsFillBagCheckFill size={"1.5em"} className="!text-textColor" />,
      label: <div className="text-textColor flex items-center">اشخاص</div>,
      children: [
        {
          key: "/customers",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "اشخاص" },
                  { label: "لیست اشخاص" },
                ])
              }
              className="text-textColor flex items-center"
            >
              لیست اشخاص
            </div>
          ),
        },
        {
          key: "/customers/roles",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "اشخاص" },
                  { label: "نقش های اشخاص" },
                ])
              }
              className="text-textColor flex items-center"
            >
              نقش ها
            </div>
          ),
        },
        {
          key: "/customers/groups",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "اشخاص" },
                  { label: "نقش های اشخاص" },
                ])
              }
              className="text-textColor flex items-center"
            >
              گروه ها
            </div>
          ),
        },
      ],
    },
    {
      key: "/prices",
      icon: <MdPriceChange size={"1.5em"} className="!text-textColor" />,
      label: <div className="text-textColor flex items-center">قیمت ها</div>,
      children: [
        {
          key: "/prices",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "قیمت ها" },
                  { label: "لیست قیمت ها" },
                ])
              }
              className="text-textColor flex items-center"
            >
              لیست قیمت ها
            </div>
          ),
        },
        {
          key: "/prices/groups",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "قیمت ها" },
                  { label: "لیست گروه قیمت گذاری" },
                ])
              }
              className="text-textColor flex items-center"
            >
              گروه قیمت گذاری
            </div>
          ),
        },
      ],
    },
    {
      key: "/commissions",
      icon: <MdPriceChange size={"1.5em"} className="!text-textColor" />,
      label: <div className="text-textColor flex items-center">پورسانت ها</div>,
      children: [
        {
          key: "/commissions",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "پورسانت ها" },
                  { label: "لیست پورسانت ها" },
                ])
              }
              className="text-textColor flex items-center"
            >
              لیست پورسانت
            </div>
          ),
        },
      ],
    },
    {
      key: "/products",
      icon: <AiFillProduct size={"1.5em"} className="!text-textColor" />,
      label: <div className="text-textColor flex items-center">محصولات</div>,
      children: [
        {
          key: "/products",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "محصولات" },
                  { label: "لیست محصولات" },
                ])
              }
              className="text-textColor flex items-center"
            >
              لیست محصولات
            </div>
          ),
        },
        {
          key: "/products/categories",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "محصولات" },
                  { label: "لیست دسته بندی ها" },
                ])
              }
              className="text-textColor flex items-center"
            >
              دسته بندی ها
            </div>
          ),
        },
        {
          key: "/products/creators",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "محصولات" },
                  { label: "لیست سازندگان محصول" },
                ])
              }
              className="text-textColor flex items-center"
            >
              سازندگان محصول
            </div>
          ),
        },
      ],
    },
    {
      key: "/conditions",
      icon: <FaListCheck size={"1.5em"} className="!text-textColor" />,
      label: (
        <div className="text-textColor flex items-center">اضافات و کسورات</div>
      ),
      children: [
        {
          key: "/conditions",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "اضافات کسورات" },
                  { label: "لیست اضافه کسری ها" },
                ])
              }
              className="text-textColor flex items-center"
            >
              لیست
            </div>
          ),
        },
        {
          key: "/conditions/limits",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "اضافات و کسورات" },
                  { label: "تعیین شرط برای اضافه کسری" },
                ])
              }
              className="text-textColor flex items-center"
            >
              تعیین شرط
            </div>
          ),
        },
      ],
    },
    {
      key: "/factors",
      icon: <MdFactCheck size={"1.5em"} className="!text-textColor" />,
      label: <div className="text-textColor flex items-center">فاکتور ها</div>,
      children: [
        // {
        //   key: "/factors/initial",
        //   icon: <GoDot size={"1em"} className="!text-textColor" />,
        //   label: (
        //     <div
        //       onClick={() =>
        //         handleAddToPageNames([
        //           { label: "فاکتور ها" },
        //           { label: "لیست فاکتور های درخواست اولیه" },
        //         ])
        //       }
        //       className="text-textColor flex items-center"
        //     >
        //       درخواست اولیه
        //     </div>
        //   ),
        // },
        {
          key: "/factors/preFactors",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "فاکتور ها" },
                  { label: "لیست پیش فاکتور ها" },
                ])
              }
              className="text-textColor flex items-center"
            >
              پیش فاکتور
            </div>
          ),
        },
        {
          key: "/factors",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "فاکتور ها" },
                  { label: "لیست فاکتور ها" },
                ])
              }
              className="text-textColor flex items-center"
            >
              فاکتور
            </div>
          ),
        },
        {
          key: "/factors/rejected",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "فاکتور ها" },
                  { label: "لیست فاکتور های مرجوعی" },
                ])
              }
              className="text-textColor flex items-center"
            >
              مرجوعی
            </div>
          ),
        },
      ],
    },
    {
      key: "/warehouses",
      icon: <FaWarehouse size={"1.5em"} className="!text-textColor" />,
      label: <div className="text-textColor flex items-center">انبار ها</div>,
      children: [
        {
          key: "/warehouses",
          icon: <GoDot size={"1em"} className="!text-textColor" />,
          label: (
            <div
              onClick={() =>
                handleAddToPageNames([
                  { label: "انبار ها" },
                  { label: "لیست انبار ها" },
                ])
              }
              className="text-textColor flex items-center"
            >
              لیست انبار ها
            </div>
          ),
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
