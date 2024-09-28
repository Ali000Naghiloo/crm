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
import AllRoutes from "./Routes";
import { Flip, ToastContainer } from "react-toastify";

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
            Tree: {
              titleHeight: "50px",
              colorBgLayout: "#000",
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
            <div className={`w-full max-w-[1900px] mx-auto flex iranSansFaNum`}>
              <AllRoutes />
            </div>
          </Provider>
        </Router>
      </ConfigProvider>
    </>
  );
}

export default App;
