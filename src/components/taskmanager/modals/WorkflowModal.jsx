import { Button, ColorPicker, Dropdown, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import useHttp from "../httpConfig/useHttp";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

const colors = [
  { color: "#3498db", name: "آسمانی" }, // Aseman (Sky)
  { color: "#ff6b6b", name: "ثریا" }, // Soraya (Bright Star or Pleiades)
  { color: "#2ecc71", name: "سبز" }, // Sabz (Green)
  { color: "#f1c40f", name: "طلایی" }, // Tala (Gold)
  { color: "#8e44ad", name: "بنفش" }, // Banafsh (Purple)
  { color: "#34495e", name: "شبنم" }, // Shabnam (Dew)
  { color: "#e67e22", name: "نارنجی" }, // Narenji (Orange)
  { color: "#1abc9c", name: "دریا" }, // Darya (Sea)
  { color: "#e84393", name: "گل‌رنگ" }, // Golrang (Flower Color, Pinkish)
];

export default function WorkflowModal({
  open,
  setOpen,
  id,
  data,
  boardId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const validationSchema = yup.object().shape({
    name: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      name: "",
      description: "",
      color: "",
      boardId: "",
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
      .post("/WorkFlowController/AddNewWorkFlowToBoard", formData)
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

  // const handleGetData = async () => {
  //   setLoading(true);
  //   const formData = {
  //     workflowid: id,
  //   };

  //   await httpService
  //     .get("/WorkFlowController/EditWorkFlow", { params: formData })
  //     .then((res) => {
  //       if (res.status >= 200 && res.status > 300 && res.data?.data) {
  //         setData(res.data?.data);
  //       }
  //     })
  //     .catch(() => {});

  //   setLoading(false);
  // };

  const handleClose = () => {
    setOpen(false);
    validation.resetForm();
  };

  const handleRenderSelectedColor = () => {
    const selected = colors.filter((c) => c.color == validation.values.color);

    return (
      <div
        className={`w-full text-white rounded text-center`}
        style={{ background: selected.color }}
      >
        {selected.name}
      </div>
    );
  };

  useEffect(() => {
    if (id) {
      setTitle("ویرایش کانبان");
    } else {
      setTitle("تعریف کانبان جدید");
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      validation.setValues({
        boardId: boardId,
        color: data?.color,
        description: data?.description,
        name: data?.name,
      });
    }
  }, [data]);

  useEffect(() => {
    if (boardId) {
      validation.setFieldValue("boardId", boardId);
    }
  }, [boardId]);

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
      <div className="w-full flex flex-col justify-between items-center flex-wrap gap-2 py-5">
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
          <div className="w-[300px] flex justify-center">
            <Select
              className="w-full h-fit text-center"
              value={validation.values.color}
              onChange={(e) => validation.setFieldValue("color", e)}
              options={colors.map((c) => {
                return {
                  label: (
                    <div
                      className={`w-full text-white p-2 rounded text-center`}
                      style={{ background: c.color }}
                    >
                      {c.name}
                    </div>
                  ),
                  value: c.color,
                };
              })}
              placeholder={<span>رنگ کانبان خود را انتخاب کنید</span>}
              children={
                validation.values.color ? (
                  handleRenderSelectedColor()
                ) : (
                  <span>رنگ کانبان خود را انتخاب کنید</span>
                )
              }
            />
          </div>
          {validation.errors.color && validation.touched.color && (
            <span className="text-error">{validation.errors.color}</span>
          )}
        </div>

        {/* description */}
        <div className="flex flex-col gap-1 w-full">
          <span>توضیحات </span>
          <Input.TextArea
            rows={5}
            placeholder="توضیحات را وارد کنید"
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
