import { Button, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import useHttp from "../httpConfig/useHttp";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import MyDatePicker from "../../../common/MyDatePicker";

export default function ProjectModal({ open, setOpen, id, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [data, setData] = useState(null);

  const [allUsers, setAllUsers] = useState(null);

  const allEnum = useSelector((state) => state.allEnum?.allEnum);

  const validationSchema = yup.object().shape({
    name: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      name: "",
      description: "",
      dueDateTime: null,
      projectPriority: 0,
      projectStatus: 0,
      projectType: 0,
      sprintNumber: 0,
      color: "",
      projectAssignedUsersViewModel: [],
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
      projectAssignedUsersViewModel: values?.projectAssignedUsersViewModel?.map(
        (us) => {
          return {
            userId: us,
            projectRoles: [],
          };
        }
      ),
      attachmentsCreateViewModel: values?.attachmentsCreateViewModel?.map(
        (att) => {
          return { id: att.id };
        }
      ),
    };

    await httpService
      .post("/ProjectController/CreateProject", formData)
      .then((res) => {
        if (res.status >= 200 && res.status < 300 && res.data?.code == 1) {
          toast.success("پروژه با موفقیت ثبت شد");
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
      projectAssignedUsersViewModel: values?.projectAssignedUsersViewModel?.map(
        (us) => {
          return {
            userId: us,
            projectRoles: [],
          };
        }
      ),
      attachmentEditViewModels: values?.attachmentsCreateViewModel?.map(
        (att) => {
          return { id: att.id };
        }
      ),
    };

    await httpService
      .post("/ProjectController/EditProject", formData)
      .then((res) => {
        if (res.status >= 200 && res.status < 300 && res.data?.code == 1) {
          toast.success("پروژه با موفقیت بروزرسانی شد");
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

  const handleGetData = async () => {
    setLoading(true);
    const formData = {
      projectId: id,
    };

    await httpService
      .get("/ProjectController/EditProject", { params: formData })
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
      setTitle("تعریف پروژه جدید");
    }
  }, [open]);

  useEffect(() => {
    if (!allUsers) {
      handleGetAllUsers();
    }
  }, []);

  useEffect(() => {
    if (data) {
      validation.setFieldValue("name", data?.name);
      validation.setFieldValue("dueDateTime", data?.dueDateTime);
      validation.setFieldValue(
        "projectAssignedUsersViewModel",
        data?.projectAssignedUsersViewModel &&
          data?.projectAssignedUsersViewModel?.length !== 0
          ? data?.projectAssignedUsersViewModel?.map((i) => {
              return i?.userId;
            })
          : []
      );
      validation.setFieldValue("projectPriority", data?.projectPriority);
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
            <span>نام پروژه </span>
            <Input
              placeholder="نام پروژه را وارد کنید"
              className="w-full"
              name="name"
              value={validation.values.name}
              onChange={validation.handleChange}
            />
            {validation.errors.name && validation.touched.name && (
              <span className="text-error">{validation.errors.name}</span>
            )}
          </div>

          {/* type */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>نوع پروژه </span>
            <Select
              options={allEnum?.ProjectType?.map((i, index) => {
                return { label: i, value: index };
              })}
              placeholder="نوع پروژه را وارد کنید"
              className="w-full"
              name="projectType"
              value={validation.values.projectType}
              onChange={(e) => {
                validation.setFieldValue("projectType", e);
              }}
            />
            {validation.errors.projectType &&
              validation.touched.projectType && (
                <span className="text-error">
                  {validation.errors.projectType}
                </span>
              )}
          </div>

          {/* users */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>کاربران پروژه </span>
            <Select
              optionFilterProp="label"
              options={allUsers}
              mode="multiple"
              placeholder="کاربران پروژه را وارد کنید"
              className="w-full"
              name="projectAssignedUsersViewModel"
              value={validation.values.projectAssignedUsersViewModel}
              onChange={(e) => {
                validation.setFieldValue("projectAssignedUsersViewModel", e);
              }}
            />
            {validation.errors.projectAssignedUsersViewModel &&
              validation.touched.projectAssignedUsersViewModel && (
                <span className="text-error">
                  {validation.errors.projectAssignedUsersViewModel}
                </span>
              )}
          </div>

          {/* project date */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>تاریخ انجام پروژه (اختیاری) </span>
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

          {/* project priority */}
          <div className="flex flex-col gap-1 w-[300px]">
            <span>اولویت پروژه </span>
            <Input
              type="number"
              className="w-full"
              name="projectPriority"
              value={validation.values.projectPriority}
              onChange={validation.handleChange}
              placeholder={"اولویت را وارد کنید"}
            />
            {validation.errors.projectPriority &&
              validation.touched.projectPriority && (
                <span className="text-error">
                  {validation.errors.projectPriority}
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
