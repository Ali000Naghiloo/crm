import { Button, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import React, { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import useHttp from "../../hooks/useHttps";
import { toast } from "react-toastify";

export default function UnitModal({ open, setOpen, data, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    unitName: yup.string().required("این فیلد اجباری است"),
  });
  const validation = useFormik({
    initialValues: {
      unitName: "",
      abbreviation: "",
      unitType: 0,
      printName: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (data) {
        handleEdit(values);
      } else {
        handleCreate(values);
      }
    },
  });

  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const handleClose = () => {
    validation.resetForm();
    setOpen(false);
  };

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = { ...values };

    await httpService
      .post("/Unit/CreateUnit", formData)
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          toast.success("با موفقیت ثبت شد");
          handleClose();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };
  const handleEdit = async (values) => {};

  return (
    <Suspense>
      <Modal
        title={data ? `ویرایش واحد ${data?.unitName}` : "تعریف واحد جدید"}
        open={open}
        loading={loading}
        onCancel={handleClose}
        className=""
        footer={
          <div className="w-full flex justify-end gap-5">
            <Button type="primary" danger>
              لغو
            </Button>
            <Button onClick={validation.submitForm} type="primary">
              ثبت
            </Button>
          </div>
        }
      >
        <div className="w-full flex flex-wrap gap-5 py-10">
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نوع </span>
            <Select
              value={validation.values.unitType}
              name="unitType"
              options={
                allEnum
                  ? allEnum?.UnitType?.map((i, index) => {
                      return { label: i, value: index };
                    })
                  : []
              }
              onChange={(e) => validation.setFieldValue("unitType", e)}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.unitType && validation.errors.unitType && (
              <span className="text-red-300 text-xs">
                {validation.errors.unitType}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>عنوان </span>
            <Input
              value={validation.values.unitName}
              name="unitName"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.unitName && validation.errors.unitName && (
              <span className="text-red-300 text-xs">
                {validation.errors.unitName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>عنوان در پرینت </span>
            <Input
              value={validation.values.printName}
              name="printName"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.printName && validation.errors.printName && (
              <span className="text-red-300 text-xs">
                {validation.errors.printName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>عنوان اختصاری </span>
            <Input
              value={validation.values.abbreviation}
              name="abbreviation"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.abbreviation &&
              validation.errors.abbreviation && (
                <span className="text-red-300 text-xs">
                  {validation.errors.abbreviation}
                </span>
              )}
          </div>
        </div>
      </Modal>
    </Suspense>
  );
}
