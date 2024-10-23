import { Layout } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "./common/SideMenu";
import AppHeader from "./common/Header";
import AllRoutes from "./Routes";
import { setSideMenuIsOpen } from "./store/reducers/sideMenu";
import { useWindowSize } from "@uidotdev/usehooks";
import { useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

export default function MyLayout() {
  const openMenu = useSelector((state) => state?.sideMenu.isOpen);
  const dispatch = useDispatch();
  const size = useWindowSize();
  const { pathname } = useLocation();

  // handler
  const handleLayoutMargin = () => {
    if (pathname && pathname !== "/login") {
      if (openMenu) {
        return "lg:mr-[200px]";
      } else {
        return "lg:mr-[80px]";
      }
    } else {
      return "";
    }
  };

  // component
  const MySidebar = () => {
    if (pathname && pathname !== "/login") {
      if (size && size.width > 1000) {
        return (
          <Sider
            collapsible
            collapsed={!openMenu}
            onCollapse={(e) => dispatch(setSideMenuIsOpen(!e))}
            className="h-screen overflow-y-auto !fixed top-0 right-0 !p-0"
          >
            <SideMenu />
          </Sider>
        );
      } else {
        return <SideMenu />;
      }
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Layout hasSider>
        <MySidebar />
      </Layout>
      <Layout className={`${handleLayoutMargin()} bg-[#5B99C2]`}>
        <Header className="sticky top-0 h-auto p-0 z-50">
          <AppHeader />
        </Header>
        <Content className="overflow-auto py-[24px] px-[16px] flex justify-center items-start max-h-pagesHeight">
          <div className="w-full p-[24px] text-center bg-white rounded-xl max-w-[1600px]">
            <AllRoutes />
          </div>
        </Content>
        <Footer className="text-center py-5">
          توسعه و طراحی توسط تیم شرکت فرتاک آراد راهور ایمن
        </Footer>
      </Layout>
    </>
  );
}
