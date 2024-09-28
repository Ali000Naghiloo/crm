import { Spin } from "antd";
import logo from "../assets/images/logo.png";

export default function Loading() {
  return (
    <>
      <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-white flex flex-col justify-center items-center">
        <img src={logo} alt="logo" className="" />
        <Spin
          tip={<div className="text-nowrap">در حال گرفتن اطلاعات...</div>}
          size="large"
        >
          <div className="p-20"></div>
        </Spin>
      </div>
    </>
  );
}
