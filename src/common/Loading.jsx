import { Spin } from "antd";
import logo from "../assets/images/logo.svg";

export default function Loading() {
  return (
    <>
      <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-loginForm flex flex-col justify-center items-center z-50">
        <img src={logo} alt="logo" className="text-blue-500" />
        <div className="w-full flex flex-col items-center gap-10 mt-10">
          <Spin size="large" className="animate-bounce" />
          <div className="text-nowrap text-white animate-pulse">
            در حال گرفتن اطلاعات...
          </div>
        </div>
      </div>
    </>
  );
}
