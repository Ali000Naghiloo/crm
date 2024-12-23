import { Button, Form, Input } from "antd";
import React from "react";
import { BsSendFill } from "react-icons/bs";
import { HiOutlineUpload } from "react-icons/hi";
import { MdSettingsVoice } from "react-icons/md";

export default function ChatForm({
  value,
  handleChange,
  handleUpload,
  handleSubmit,
  loading,
  ref,
}) {
  return (
    <>
      <Form
        onFinish={handleSubmit}
        className="max-w-3xl mx-auto flex items-center h-full w-full"
      >
        <Input
          ref={ref}
          // disabled={loading}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="پیام خود را در اینجا وارد نمایید ..."
          aria-label="Message input"
          className="h-full w-full flex-1 border border-gray-300 rounded-l-none rounded-r-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* upload */}
        {/* <input type="file" hidden name="upload" /> */}
        <Button className="!h-full rounded-none relative">
          <input
            type="file"
            hidden={true}
            className="invisible w-full h-full absolute top-0 bottom-0"
          />
          <HiOutlineUpload size={"1.5em"} />
        </Button>
        {/* voice */}
        <Button className="!h-full rounded-none">
          <MdSettingsVoice size={"1.5em"} />
        </Button>
        {/* submit */}
        <Button className="h-full rounded-l rounded-r-none" htmlType="submit">
          <BsSendFill />
        </Button>
      </Form>
    </>
  );
}
