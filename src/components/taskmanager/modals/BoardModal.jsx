import { Button, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import useHttp from "../httpConfig/useHttp";
import crmHttp from "../../../hooks/useHttps";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import MyDatePicker from "../../../common/MyDatePicker";

export default function BoardModal({
  open,
  setOpen,
  id,
  projectId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const { httpService: crmHttpService } = crmHttp();
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
      sprintNumber: 0,
      color: "",
      projectId: projectId,
      projectType: 0,
      boardWorkFlowsCreateViewModels: [],
      boardUsersId: [],
      attachmentsCreateViewModel: [],
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
      boardWorkFlowsCreateViewModels:
        values?.boardWorkFlowsCreateViewModels?.map((br, index) => {
          return {
            id: br,
            location: index,
          };
        }),
      attachmentsCreateViewModel: values?.attachmentsCreateViewModel?.map(
        (att) => {
          return { id: att.id };
        }
      ),
    };

    await httpService
      .post("/BoardController/CreateBoard", formData)
      .then((res) => {
        if (res.status >= 200 && res.status < 300 && res.data?.code == 1) {
          toast.success("برد با موفقیت ثبت شد");
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
      boardWorkFlowsEditViewModels: values?.boardWorkFlowsCreateViewModels?.map(
        (br, index) => {
          return {
            id: br,
            location: index,
          };
        }
      ),
      attachmentsEditViewModel: values?.attachmentsCreateViewModel?.map(
        (att) => {
          return { id: att.id };
        }
      ),
    };

    await httpService
      .post("/BoardController/EditBoard", formData)
      .then((res) => {
        if (res.status >= 200 && res.status < 300 && res.data?.code == 1) {
          toast.success("برد با موفقیت بروزرسانی شد");
          getNewList();
          handleClose();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    validation.resetForm();
  };

  const handleGetAllUsers = async () => {
    let datas = [];
    const formData = { projectId: projectId };

    await httpService
      .get("/ProjectController/ProjectUsers", { params: formData })
      .then((res) => {
        if (res.status == 200 && res.data?.code) {
          res.data?.data?.map((u) => {
            // let role = u?.roleMappings?.filter(
            //   (role) => role?.customerRole == "کارمند"
            // );
            datas.push({ ...u, label: u.fullName, value: u.userId });
          });
        }
      })
      .catch(() => {});

    setAllUsers(datas);
  };

  const handleGetAllWorkflows = async () => {
    let datas = [];

    await httpService
      .get("/WorkFlowController/DefaultWorkFlows")
      .then((res) => {
        if (res.status == 200 && res.data?.code) {
          res.data?.data?.map((u) =>
            datas.push({
              label: (
                <div className={`w-full !bg-[${u?.color}] text-lg`}>
                  {u.name}
                </div>
              ),
              value: u.id,
            })
          );
        }
      })
      .catch(() => {});

    await httpService
      .get("/WorkFlowController/WorkFlows")
      .then((res) => {
        if (res.status == 200 && res.data?.code) {
          res.data?.data?.map((u) =>
            datas.push({
              label: (
                <div className={`w-full !bg-[${u?.color}] text-lg`}>
                  {u.name}
                </div>
              ),
              value: u.id,
            })
          );
        }
      })
      .catch(() => {});

    setWorkflows(datas);
  };

  const handleGetData = async () => {
    setLoading(true);
    const formData = {
      boardid: id,
    };

    await httpService
      .get("/BoardController/EditBoard", { params: formData })
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
      setTitle("تعریف برد جدید");
    }

    handleGetAllUsers();
  }, [open]);

  useEffect(() => {
    handleGetAllUsers();
    handleGetAllWorkflows();
  }, []);

  useEffect(() => {
    if (data) {
      validation.setFieldValue("name", data?.name);
      validation.setFieldValue(
        "boardWorkFlowsCreateViewModels",
        data?.boardWorkFlowsViewModel &&
          data?.boardWorkFlowsViewModel?.length !== 0
          ? data?.boardWorkFlowsViewModel?.map((i) => {
              return i?.id;
            })
          : []
      );
      validation.setFieldValue(
        "boardUsersId",
        data?.boardUsersViewModel
          ? data?.boardUsersViewModel?.map((u) => {
              return u?.userId;
            })
          : []
      );
      validation.setFieldValue("description", data?.description);
    }
  }, [data]);

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
            <span>نام برد </span>
            <Input
              placeholder="نام برد را وارد کنید"
              className="w-full"
              name="name"
              value={validation.values.name}
              onChange={validation.handleChange}
            />
            {validation.errors.name && validation.touched.name && (
              <span className="text-error">{validation.errors.name}</span>
            )}
          </div>

          {/* workflows */}
          {/* <div className="flex flex-col gap-1 w-[300px]">
            <span>کانبان های برد </span>
            <Select
              mode="multiple"
              options={workflows}
              placeholder="نوع برد را وارد کنید"
              className="w-full"
              name="boardWorkFlowsCreateViewModels"
              value={validation.values.boardWorkFlowsCreateViewModels}
              onChange={(e) => {
                validation.setFieldValue("boardWorkFlowsCreateViewModels", e);
              }}
            />
            {validation.errors.boardWorkFlowsCreateViewModels &&
              validation.touched.boardWorkFlowsCreateViewModels && (
                <span className="text-error">
                  {validation.errors.boardWorkFlowsCreateViewModels}
                </span>
              )}
          </div> */}

          {/* users */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>کاربران برد </span>
            <Select
              optionFilterProp="label"
              options={allUsers}
              mode="multiple"
              placeholder="کاربران برد را وارد کنید"
              className="w-full"
              name="boardUsersId"
              value={validation.values.boardUsersId}
              onChange={(e) => {
                validation.setFieldValue("boardUsersId", e);
              }}
            />
            {validation.errors.boardUsersId &&
              validation.touched.boardUsersId && (
                <span className="text-error">
                  {validation.errors.boardUsersId}
                </span>
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
