import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// icons
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoPersonSharp } from "react-icons/io5";
//
import { BsFillBagCheckFill } from "react-icons/bs";
import { MdFactCheck, MdPriceChange } from "react-icons/md";
import { GoDot } from "react-icons/go";
import { AiFillProduct } from "react-icons/ai";
import { FaListCheck, FaWeightScale } from "react-icons/fa6";
import { HiDocumentReport } from "react-icons/hi";
import { MdManageSearch } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";

export default function useSideMenuItems() {
  const userRole = useSelector((state) => state.userData.userRole);
  let [items, setItems] = useState([]);

  useEffect(() => {
    if (userRole) {
      if (userRole === "admin") {
        setItems([
          {
            key: "/",
            icon: <TbLayoutDashboardFilled size={"1.5em"} />,
            label: "داشبورد",
          },
          {
            key: "/employees",
            icon: <IoPersonSharp size={"1.5em"} />,
            label: "کارمندان",
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
      if (userRole === "user") {
        setItems([
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
            key: "/units",
            icon: <FaWeightScale size={"1.5em"} className="" />,
            label: "واحد ها",
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
            key: "/warehouses",
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
        ]);
      }
    }
  }, [userRole]);

  return {
    items,
  };
}
