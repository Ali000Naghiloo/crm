import "./App.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import React from "react";
import { ConfigProvider, Layout } from "antd";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter as Router } from "react-router-dom";
import fa_IR from "antd/locale/fa_IR";
import AllRoutes from "./Routes";
import { Flip, ToastContainer } from "react-toastify";
import SideMenu from "./components/SideMenu";
import AppHeader from "./common/Header";
const { Header, Content, Footer, Sider } = Layout;
const siderStyle = {
  insetInlineStart: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

function App() {
  return (
    <>
      <ConfigProvider
        direction="rtl"
        theme={{
          components: {
            Menu: { itemSelectedBg: "#2ecc71" },
            Table: {
              rowHoverBg: "rgba(0,0,0,0.1)",
            },
            Breadcrumb: { colorText: "#fff" },
            List: { colorText: "#fff" },
            Tree: {
              titleHeight: "70px",
            },
          },
          token: {
            fontFamily: "iranSansFaNum",
            colorPrimaryHover: "",
            colorBgTextHover: "",
            colorTextBase: "",
          },
        }}
        locale={fa_IR}
      >
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Flip}
          className={"!iranSansFaNum"}
          style={{ fontFamily: "iranSansFaNum !important" }}
        />

        <Router>
          <Provider store={store}>
            {/* <div className={`w-full max-w-[1900px] mx-auto flex iranSansFaNum`}>
              <AllRoutes />
            </div> */}
            <Layout hasSider>
              <Sider
                collapsible
                // style={siderStyle}
                className="h-screen overflow-y-auto !fixed top-0 right-0 !p-0"
              >
                <SideMenu />
              </Sider>
            </Layout>
            <Layout className="lg:mr-[200px]">
              <Header className="h-auto p-0">
                <AppHeader />
              </Header>
              <Content className="overflow-auto py-[24px] px-[16px] flex justify-center items-start">
                <div className="w-full p-[24px] text-center bg-backgroundColor !text-white rounded-xl max-w-[1600px]">
                  <AllRoutes />
                </div>
              </Content>
              <Footer className="text-center">
                توسعه و طراحی توسط تیم شرکت فرتاک آراد راهور ایمن
              </Footer>
            </Layout>
          </Provider>
        </Router>
      </ConfigProvider>
    </>
  );
}

export default App;
