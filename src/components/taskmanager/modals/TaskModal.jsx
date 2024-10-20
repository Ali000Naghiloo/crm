import { Button, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import useHttp from "../httpConfig/useHttp";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import MyDatePicker from "../../../common/MyDatePicker";

export default function TaskModal({
  open,
  setOpen,
  id,
  boardId,
  workflowId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [data, setData] = useState(null);

  const [allUsers, setAllUsers] = useState(null);
  const [workflows, setWorkflows] = useState(null);

  const allEnum = useSelector((state) => state.allEnum?.allEnum);

  const validationSchema = yup.object().shape({
    name: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      name: "",
      description: "",
      priority: 0,
      workFlow: workflowId,
      dueDateTime: null,
      remainderDateTime: null,
      boardId: boardId,
      taskAssignedUsersId: [],
      taskVerifyUsersId: [],
      attachmentCreateViewModels: [],
    },

    validationSchema,

    onSubmit: (values) => {
      if (id) {
        handleEdit(values);
      } else {
        handleCreate(values);
      }
    },
  });

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
    };

    await httpService
      .post("/TaskController/CreateTask", formData)
      .then((res) => {
        if (res.status >= 200 && res.status < 300 && res.data?.code == 1) {
          toast.success("وظیفه با موفقیت تعریف شد");
          getNewList();
          handleClose();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
      id: id,
    };

    await httpService
      .post("/TaskController/EditTask", formData)
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          toast.success("وظیفه با موفقیت بروز شد");
          getNewList();
          handleClose();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGetAllUsers = async () => {
    let datas = [];

    await httpService
      .get("/Account/GetAllUsers")
      .then((res) => {
        if (res.status == 200 && res.data?.code) {
          res.data?.data?.map((u) =>
            datas.push({ label: u.fullName, value: u.id })
          );
        }
      })
      .catch(() => {});

    setAllUsers(datas);
  };

  const handleGetAllWorkFlows = async () => {
    let datas = [];
    const formData = {
      boardid: boardId,
    };

    await httpService
      .get("/WorkFlowController/BoardWorkFlows", { params: formData })
      .then((res) => {
        if (res.status == 200 && res.data?.code) {
          res.data?.data?.map((u) =>
            datas.push({ label: u.name, value: u.id })
          );
        }
      })
      .catch(() => {});

    setWorkflows(datas);
  };

  const handleGetData = async () => {
    setLoading(true);
    const formData = {
      taskid: id,
    };

    await httpService
      .get("/TaskController/TaskDetails", { params: formData })
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          setTitle(res.data?.data?.name);
          setData(res.data?.data);
        }
      });

    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      handleGetData();
    } else {
      setTitle("تعریف وظیفه جدید");
    }
  }, [open]);

  useEffect(() => {
    if (!allUsers) {
      handleGetAllUsers();
    }
    if (!workflows) {
      handleGetAllWorkFlows();
    }
  }, []);

  useEffect(() => {
    if (data) {
      validation.setFieldValue("name", data?.name);
      validation.setFieldValue("dueDateTime", data?.dueDateTime);
      validation.setFieldValue("workFlow", data?.workFlow);
      validation.setFieldValue("description", data?.description);
    }
  }, [data]);

  useEffect(() => {
    validation.setFieldValue("workFlow", workflowId);
  }, [workflowId]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        loading={loading}
        title={title}
        className="lg:min-w-[990px] w-full"
        footer={
          <div className="w-full flex justify-end gap-3">
            <Button type="primary" danger onClick={handleClose}>
              لغو
            </Button>
            <Button type="primary" onClick={validation.submitForm}>
              ثبت
            </Button>
          </div>
        }
      >
        <div className="w-full flex flex-wrap gap-5 pt-10 pb-5">
          {/* name */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>نام وظیفه </span>
            <Input
              placeholder="نام وظیفه را وارد کنید"
              className="w-full"
              name="name"
              value={validation.values.name}
              onChange={validation.handleChange}
            />
            {validation.errors.name && validation.touched.name && (
              <span className="text-error">{validation.errors.name}</span>
            )}
          </div>

          {/* users */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>کاربران وظیفه </span>
            <Select
              optionFilterProp="label"
              options={allUsers}
              mode="multiple"
              placeholder="کاربران وظیفه را وارد کنید"
              className="w-full"
              name="taskAssignedUsersId"
              value={validation.values.taskAssignedUsersId}
              onChange={(e) => {
                validation.setFieldValue("taskAssignedUsersId", e);
              }}
            />
            {validation.errors.taskAssignedUsersId &&
              validation.touched.taskAssignedUsersId && (
                <span className="text-error">
                  {validation.errors.taskAssignedUsersId}
                </span>
              )}
          </div>

          {/* users to watch */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>مسئولین پیگیری وظیفه </span>
            <Select
              optionFilterProp="label"
              options={allUsers}
              mode="multiple"
              placeholder="کاربران تایید کننده وظیفه را وارد کنید"
              className="w-full"
              name="taskVerifyUsersId"
              value={validation.values.taskVerifyUsersId}
              onChange={(e) => {
                validation.setFieldValue("taskVerifyUsersId", e);
              }}
            />
            {validation.errors.taskVerifyUsersId &&
              validation.touched.taskVerifyUsersId && (
                <span className="text-error">
                  {validation.errors.taskVerifyUsersId}
                </span>
              )}
          </div>

          {/* workflow */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>کانبان </span>
            <Select
              optionFilterProp="label"
              options={workflows}
              mode="multiple"
              placeholder="کاربران تایید کننده وظیفه را وارد کنید"
              className="w-full"
              name="workFlow"
              value={validation.values.workFlow}
              onChange={(e) => {
                validation.setFieldValue("workFlow", e);
              }}
            />
            {validation.errors.workFlow && validation.touched.workFlow && (
              <span className="text-error">{validation.errors.workFlow}</span>
            )}
          </div>

          {/* task date */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>تاریخ انجام وظیفه (اختیاری) </span>
            <MyDatePicker
              value={validation.values.dueDateTime}
              setValue={(e) => {
                validation.setFieldValue("dueDateTime", e);
              }}
              placeholder={"تاریخ را وارد کنید"}
              className={"w-[300px]"}
            />
            {validation.errors.dueDateTime &&
              validation.touched.dueDateTime && (
                <span className="text-error">
                  {validation.errors.dueDateTime}
                </span>
              )}
          </div>

          {/* task reminder date */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>تاریخ یادآور وظیفه </span>
            <MyDatePicker
              value={validation.values.remainderDateTime}
              setValue={(e) => {
                validation.setFieldValue("remainderDateTime", e);
              }}
              placeholder={"تاریخ را وارد کنید"}
              className={"w-[300px]"}
            />
            {validation.errors.remainderDateTime &&
              validation.touched.remainderDateTime && (
                <span className="text-error">
                  {validation.errors.remainderDateTime}
                </span>
              )}
          </div>

          {/* task priority */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>اولویت وظیفه </span>
            <Input
              type="number"
              className="w-full"
              name="priority"
              value={validation.values.priority}
              onChange={validation.handleChange}
              placeholder={"اولویت را وارد کنید"}
            />
            {validation.errors.priority && validation.touched.priority && (
              <span className="text-error">{validation.errors.priority}</span>
            )}
          </div>

          {/* description */}
          <div className="flex flex-col gap-1 w-full">
            <span>توضیحات </span>
            <Input.TextArea
              rows={5}
              className="w-full"
              name="description"
              value={validation.values.description}
              onChange={validation.handleChange}
            />
            {validation.errors.description &&
              validation.touched.description && (
                <span className="text-error">
                  {validation.errors.description}
                </span>
              )}
          </div>
        </div>
      </Modal>
    </>
  );
}
