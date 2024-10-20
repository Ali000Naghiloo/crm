import React, { useEffect, useState } from "react";
import useHttp from "../../../../httpConfig/useHttp";
import { Button, Form, Input } from "antd";
import { HiOutlineUpload } from "react-icons/hi";
import { MdSettingsVoice } from "react-icons/md";
import { BsSendFill } from "react-icons/bs";

export default function Group({ boardId }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState(null);
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = () => {};

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleGetReports = async () => {
    setLoading(true);
    const formData = {
      boardid: boardId,
    };

    await httpService
      .get("/Report/BoardReports", { params: formData })
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          setReports(res.data?.data);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    handleGetReports();
  }, []);

  return (
    <>
      <div className="w-full h-full bg-white flex flex-col justify-end p-5">
        <div className="w-full h-full overflow-y-auto flex flex-col gap-4">
          {reports
            ? reports?.map((rp, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col text-center text-xl font-bold pb-5 cursor-pointer outline-2 outline-gray-300 rounded-lg"
                >
                  <span>{rp.newValue}</span>
                </div>
              ))
            : null}
        </div>

        {/* text messaging */}
        {/* <div className="w-full h-[100px] flex flex-col items-center justify-center bg-[#f6f6f6] px-10">
          <Form
            onFinish={handleSubmit}
            className="w-full mx-auto flex items-center h-[50%]"
          >
            <Input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="پیام خود را در اینجا وارد نمایید ..."
              aria-label="Message input"
              className="flex-1 border h-full border-gray-300 rounded-l-none rounded-r-3xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="!h-full rounded-none" htmlType="submit">
              <HiOutlineUpload size={"1.5em"} />
            </Button>
            <Button className="!h-full rounded-none" htmlType="submit">
              <MdSettingsVoice size={"1.5em"} />
            </Button>
            <Button
              className="!h-full rounded-l-3xl rounded-r-none"
              htmlType="submit"
            >
              <BsSendFill />
            </Button>
          </Form>
        </div> */}
      </div>
    </>
  );
}
