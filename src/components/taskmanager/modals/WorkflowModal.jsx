import { Button, ColorPicker, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import useHttp from "../httpConfig/useHttp";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

export default function WorkflowModal({
  open,
  setOpen,
  id,
  boardId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");

  const validationSchema = yup.object().shape({
    name: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      name: "",
      description: "",
      color: "",
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
      .post("/WorkFlowController/CreateWorkFlow", formData)
      .then((res) => {
        if (res.status >= 200 && res.status < 300 && res.data?.code == 1) {
          toast.success("کانبان شما با موفقیت ثبت شد");
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
      .post("/WorkFlowController/EditWorkFlow", formData)
      .then((res) => {
        if (res.status >= 200 && res.status < 300 && res.data?.code == 1) {
          toast.success("کانبان شما با موفقیت بروزرسانی شد");
          getNewList();
          handleClose();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleGetData = async () => {
    setLoading(true);
    const formData = {
      workflowid: id,
    };

    await httpService
      .get("/WorkFlowController/EditWorkFlow", { params: formData })
      .then((res) => {
        if (res.status >= 200 && res.status > 300 && res.data?.data) {
          setData(res.data?.data);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    validation.resetForm();
  };

  useEffect(() => {
    if (id) {
      handleGetData();
    } else {
      setTitle("تعریف کانبان جدید");
    }
  }, [id]);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      loading={loading}
      title={title}
      className="w-full !min-w-[700px]"
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
      <div className="w-full flex justify-between flex-wrap gap-2 py-5">
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

        {/* color */}
        <div className="flex flex-col gap-1 w-[300px]">
          <span>رنگ </span>
          <ColorPicker
            placeholder="نام برد را وارد کنید"
            className="w-full"
            name="color"
            value={validation.values.color}
            onChange={(e, value) => validation.setFieldValue("color", value)}
          />
          {validation.errors.color && validation.touched.color && (
            <span className="text-error">{validation.errors.color}</span>
          )}
        </div>

        {/* description */}
        <div className="flex flex-col gap-1 w-full">
          <span>توضیحات </span>
          <Input.TextArea
            rows={5}
            placeholder="نام برد را وارد کنید"
            className="w-full"
            name="description"
            value={validation.values.description}
            onChange={validation.handleChange}
          />
          {validation.errors.description && validation.touched.description && (
            <span className="text-error">{validation.errors.description}</span>
          )}
        </div>
      </div>
    </Modal>
  );
}
