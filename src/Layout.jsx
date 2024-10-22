import { Layout } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "./components/SideMenu";
import AppHeader from "./common/Header";
import AllRoutes from "./Routes";
import { setSideMenuIsOpen } from "./store/reducers/sideMenu";

const { Header, Content, Footer, Sider } = Layout;

export default function MyLayout() {
  const openMenu = useSelector((state) => state?.sideMenu.isOpen);
  const dispatch = useDispatch();

  return (
    <>
      <Layout hasSider>
        <Sider
          collapsible
          collapsed={openMenu}
          onCollapse={(e) => dispatch(setSideMenuIsOpen(e))}
          // style={siderStyle}
          className="h-screen overflow-y-auto !fixed top-0 right-0 !p-0"
        >
          <SideMenu />
        </Sider>
      </Layout>
      <Layout
        className={`${
          !openMenu ? "lg:mr-[200px]" : "lg:mr-[70px]"
        } bg-[#6A9AB0]`}
      >
        <Header className="h-auto p-0">
          <AppHeader />
        </Header>
        <Content className="overflow-auto py-[24px] px-[16px] flex justify-center items-start">
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
