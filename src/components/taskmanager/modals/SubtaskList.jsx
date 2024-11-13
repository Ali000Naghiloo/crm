import React, { useEffect, useState } from "react";
import useHttp from "../httpConfig/useHttp";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Checkbox, Form, Input, Select, Spin } from "antd";
import MyDatePicker from "../../../common/MyDatePicker";
import moment from "jalali-moment";
import { TiDelete } from "react-icons/ti";

const Subtask = ({ subtask, getNewList }) => {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  const handleChangeSubtaskStatus = async (e) => {
    setLoading(true);

    await httpService
      .get("/SubTaskController/SubTaskDoneStatus", {
        params: { subTaskid: subtask?.id },
      })
      .then((res) => {
        if (res.status <= 200 && res.status < 300 && res.data?.code == 1) {
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);

    await httpService
      .get("/SubTaskController/DeleteSubTask", {
        params: { subTaskid: subtask?.id },
      })
      .then((res) => {
        if (res.status <= 200 && res.status < 300 && res.data?.code == 1) {
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  return (
    <div
      key={subtask.id}
      className="w-full flex gap-2 justify-between items-center border-y border-[#ccc] rounded-md"
    >
      <div className="flex gap-2 items-center">
        <div className="h-full p-2 border-l">
          {!loading ? (
            <Checkbox
              checked={subtask.doneStatus}
              onChange={(e) => handleChangeSubtaskStatus(e.target.checked)}
            />
          ) : (
            <Spin />
          )}
        </div>
        <span
          className={subtask?.doneStatus ? "line-through text-gray-500" : ""}
        >
          {subtask.name}
        </span>
      </div>

      {/* details */}
      <div className="flex items-center gap-4 text-gray-500 pl-2">
        <div className="">{}</div>

        {subtask?.doneDateTime &&
          moment(subtask?.doneDateTime).utc().locale("fa").format("YYYY/MM/DD")}

        {!subtask?.doneDateTime
          ? subtask?.dueDateTime
            ? moment(subtask?.dueDateTime)
                .utc()
                .locale("fa")
                .format("YYYY/MM/DD")
            : null
          : null}

        <div className="cursor-pointer">
          <TiDelete onClick={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default function SubtaskList({ wfId, taskId, userList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(false);
  const [editing, setEditing] = useState(null);

  const validationSchema = yup.object().shape({
    name: yup.string().required(),
  });

  const validation = useFormik({
    initialValues: {
      id: null,
      name: "",
      description: "",
      priority: 0,
      workFlow: "",
      dueDateTime: null,
      remainderDateTime: null,
      taskId: "",
      subTaskAssignedUsersViewModels: [],
      subTaskVerifyUsersViewModels: [],
      subTaskAttachmentViewModels: [
        // {
        //   id: "",
        //   fileName: "",
        //   filePath: "",
        //   createDateTime: "",
        // },
      ],
    },

    validationSchema,

    onSubmit: (values) => {
      if (values.id) {
        handleEdit(values);
      } else {
        handleCreate(values);
      }
    },
  });

  const handleGetList = async () => {
    setLoading(true);
    let datas = null;

    await httpService
      .get("/SubTaskController/SubTasks", { params: { taskid: taskId } })
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          datas = res.data?.data;
        }
      })
      .catch(() => {});

    setList(datas);
    setLoading(false);
  };

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = { ...values };

    await httpService
      .post("/SubTaskController/CreateSubTask", formData)
      .then((res) => {
        if (res.status >= 200 && res.status < 300 && res.data?.code == 1) {
          validation.setFieldValue("name", "");
          handleGetList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = { ...values };

    await httpService
      .post("/SubTaskController/EditSubTask", formData)
      .then((res) => {
        if (res.status <= 200 && res.status < 300 && res.data?.code == 1) {
          handleGetList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    handleGetList();
  }, []);

  useEffect(() => {
    if (wfId && taskId) {
      validation.setFieldValue("workFlow", wfId);
      validation.setFieldValue("taskId", taskId);
    }
  }, [wfId, taskId]);

  return (
    <>
      <div className="w-full flex flex-col gap-10 rounded-md border border-[#ccc] border-dashed p-4 mt-5">
        <span className="mb-4 text-xl">ریز تسک ها</span>

        {/* sub task list */}
        {list && (
          <div className="w-full flex flex-col border border-[#ccc] rounded-md">
            {list.map((subtask) => (
              <Subtask
                key={subtask?.id}
                subtask={subtask}
                getNewList={handleGetList}
              />
            ))}
          </div>
        )}

        {/* add sub task */}
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex items-end"
        >
          <Input
            className="flex-1"
            placeholder="عنوان ریز وظیفه را بنویسید..."
            value={validation.values.name}
            name="name"
            onChange={validation.handleChange}
            addonBefore={
              <Button
                type="text"
                className="h-full text-center text-lg p-0 px-2"
                onClick={validation.submitForm}
              >
                +
              </Button>
            }
          />

          {/* mentions */}
          <div className="flex flex-col">
            <span>مسئولین انجام</span>
            <Select
              mode="multiple"
              maxTagCount={0}
              loading={userList ? false : true}
              options={userList}
              optionFilterProp="fullName"
              className="w-[120px]"
              allowClear
              value={validation.values.subTaskAssignedUsersViewModels}
              onChange={(e) => {
                console.log(e);
                validation.setFieldValue("subTaskAssignedUsersViewModels", e);
              }}
              placeholder="مسئولین انجام"
            />
          </div>
          <div className="flex flex-col">
            <span>مسئولین پیگیری</span>
            <Select
              mode="multiple"
              maxTagCount={0}
              options={userList}
              optionFilterProp="fullName"
              className="w-[120px]"
              allowClear
              value={validation.values.subTaskVerifyUsersViewModels}
              onChange={(e) => {
                validation.setFieldValue("subTaskVerifyUsersViewModels", e);
              }}
              placeholder="مسئولین پیگیری"
            />
          </div>
          <div className="flex flex-col">
            <span>تاریخ انجام</span>
            <MyDatePicker
              className="w-[120px]"
              value={validation.values.dueDateTime}
              setValue={(e) => {
                validation.setFieldValue("dueDateTime", e);
              }}
              placeholder="تاریخ"
            />
          </div>
        </Form>
      </div>
    </>
  );
}
