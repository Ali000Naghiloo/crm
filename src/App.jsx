import "./App.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter as Router } from "react-router-dom";
import fa_IR from "antd/locale/fa_IR";
import { Flip, ToastContainer } from "react-toastify";
import MyLayout from "./Layout";
import HandleNotification from "./common/HandleNotification";

function App() {
  return (
    <>
      <HandleNotification />

      <ConfigProvider
        direction="rtl"
        theme={{
          components: {
            Menu: {
              itemSelectedBg: "#2ecc71",
              darkItemBg: "#222831",
              popupBg: "#222831",
              darkPopupBg: "#222831",
            },
            Table: {
              // rowHoverBg: "rgba(0,0,0,0.1)",
            },
            Tree: {
              titleHeight: "40px",
            },
            Layout: {
              colorBgBase: "#222831",
              siderBg: "#222831",
              triggerBg: "#393E46",
            },
            Progress: {},
          },
          token: {
            fontFamily: "iranSansFaNum",
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
            <MyLayout />
          </Provider>
        </Router>
      </ConfigProvider>
    </>
  );
}

export default App;
