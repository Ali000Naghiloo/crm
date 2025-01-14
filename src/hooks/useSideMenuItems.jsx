import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// icons
import { TbLayoutDashboardFilled, TbLockAccess } from "react-icons/tb";
import { IoPersonSharp } from "react-icons/io5";
import { MdFactCheck, MdPerson, MdPriceChange } from "react-icons/md";
import { GoDot } from "react-icons/go";
import { AiFillProduct } from "react-icons/ai";
import { FaListCheck, FaWeightScale } from "react-icons/fa6";
import { HiDocumentReport } from "react-icons/hi";
import { MdManageSearch } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";
// menues
import { customerGroups, customerRoles } from "./menus/customers";

export default function useSideMenuItems() {
  const userRole = useSelector((state) => state.userData.userRole);
  const userAccess = useSelector((state) => state.userData.userAccess);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (userRole) {
      let items = [];
      if (userRole === "admin") {
        setItems([
          {
            key: "/",
            icon: <TbLayoutDashboardFilled size={"1.5em"} />,
            label: "داشبورد",
          },
          {
            key: "customers",
            icon: <IoPersonSharp size={"1.5em"} className="" />,
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
                key: "/customers/region",
                icon: <GoDot size={"1em"} className="" />,
                label: "درخت مناطق",
              },
              {
                key: "/customers/groups",
                icon: <GoDot size={"1em"} className="" />,
                label: "گروه",
              },
            ],
          },
          // {
          //   key: "/employees",
          //   icon: <IoPersonSharp size={"1.5em"} />,
          //   label: "کارمندان",
          // },
          {
            key: "/permissions",
            icon: <TbLockAccess size={"1.5em"} />,
            label: "سطوح دسترسی",
          },
          {
            key: "/requests",
            icon: <FaListCheck size={"1.5em"} />,
            label: "درخواست ها",
            children: [
              {
                key: "/requests/contact",
                icon: <GoDot size={"1.5em"} />,
                label: "تماس اولیه",
              },
            ],
          },
          {
            key: "/factor-settings",
            icon: <MdFactCheck size={"1.5em"} />,
            label: "تنظیمات فاکتور",
          },
        ]);
      }
      //

      if (userRole === "user") {
        let items = [
          {
            key: "/",
            icon: <TbLayoutDashboardFilled size={"1.5em"} className="" />,
            label: "داشبورد",
          },
          {
            key: "products",
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
                key: "/units",
                icon: <FaWeightScale size={"1.5em"} className="" />,
                label: "واحد ها",
              },
              {
                key: "prices",
                icon: <MdPriceChange size={"1.5em"} className="" />,
                label: "قیمت ها",
                children: [
                  {
                    key: "/prices",
                    icon: <GoDot size={"1em"} className="" />,
                    label: "تیپ های قیمتی",
                  },
                  {
                    key: "/prices/groups",
                    icon: <GoDot size={"1em"} className="" />,
                    label: "گروه قیمت گذاری",
                  },
                ],
              },
              // {
              //   key: "/products/creators",
              //   icon: <GoDot size={"1em"} className="" />,
              //   label: "تامین کنندگان کالا و خدمات",
              // },
            ],
          },
          {
            key: "/factors",
            icon: <MdFactCheck size={"1.5em"} className="" />,
            label: "فاکتور ها",
            children: [
              {
                key: "conditions",
                icon: <FaListCheck size={"1.5em"} className="" />,
                label: "اضافات و کسورات",
                // children: [
                //   {
                //     key: "/conditions",
                //     icon: <GoDot size={"1em"} className="" />,
                //     label: "فهرست",
                //   },
                // ],
              },
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
                key: "/factors/buy-factors",
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
                key: "/requests/product",
                icon: <GoDot size={"1em"} className="" />,
                label: "کالا",
              },
              {
                key: "/requests/contact",
                icon: <GoDot size={"1em"} className="" />,
                label: "تماس اولیه",
              },
              {
                key: "/requests/myRequests",
                icon: <GoDot size={"1em"} className="" />,
                label: "مدیریت درخواست ها",
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
            key: "warehouses",
            icon: <FaWarehouse size={"1.5em"} className="" />,
            label: "انبار ها",
            children: [
              {
                key: "/warehouses",
                icon: <GoDot size={"1em"} className="" />,
                label: "فهرست",
              },
            ],
          },
          {
            key: "/taskmanager",
            icon: <MdManageSearch size={"1.7em"} className="" />,
            label: "مدیریت وظیفه",
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

        // customers
        if (userAccess?.includes("GetAllCustomers")) {
          let childrens = [];
          if (userAccess?.includes("EditCustomerRole")) {
            childrens.push({ ...customerRoles });
          }
          if (true) {
            childrens.push({ ...customerGroups });
          }

          items = [
            {
              key: "customers",
              icon: <MdPerson size={"1.5em"} className="" />,
              label: "اشخاص",
              children: [
                {
                  key: "/customers",
                  icon: <GoDot size={"1em"} className="" />,
                  label: "فهرست",
                },
                ...childrens,
              ],
            },
            ...items,
          ];
        }

        setItems(items);
      }
    }
  }, [userRole]);

  return {
    items,
  };
}
