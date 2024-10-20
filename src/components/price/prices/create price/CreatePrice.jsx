import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function CreatePirce({ open, setOpen, getNewList, list }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    priceName: yup.string().required("این فیلد را پر کنید"),
    priceCurrency: yup.number().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      priceName: "",
      priceCurrency: 0,
      description: "",
      isRequired: true,
      displayOrder: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      validation.resetForm();
    }
  };

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      priceName: values?.priceName,
      description: values?.description,
      priceCurrency: values?.priceCurrency,
      isRequired: values?.isRequired,
      displayOrder: values?.displayOrder,
    };

    await httpService
      .post("/Price/CreatePrice", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت تعریف شد");
          handleClose();
        }
      })
      .catch(() => {});

    getNewList();
    setLoading(false);
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        onClose={handleClose}
        title="تعریف قیمت جدید"
        footer={
          <div className="w-full flex gap-3 justify-end pt-5">
            <Button type="primary" danger onClick={handleClose}>
              لغو
            </Button>
            <Button
              onClick={validation.submitForm}
              type="primary"
              disabled={loading}
              loading={loading}
            >
              تعریف قیمت
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نام قیمت</span>
            <Input
              value={validation.values.priceName}
              name="priceName"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.priceName && validation.errors.priceName && (
              <span className="text-red-300 text-xs">
                {validation.errors.priceName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>واحد قیمت</span>
            <Select
              options={allEnum?.PriceCurrency?.map((cur, index) => {
                return { label: cur, value: index };
              })}
              value={validation.values.priceCurrency}
              name="priceCurrency"
              onChange={(e) => {
                validation.setFieldValue("priceCurrency", e);
              }}
              className="w-full"
              placeholder="لطفا عدد وارد کنید..."
            />
            {validation.touched.priceCurrency &&
              validation.errors.priceCurrency && (
                <span className="text-red-300 text-xs">
                  {validation.errors.priceCurrency}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>اولویت نمایش</span>
            <Input
              type="number"
              value={validation.values.displayOrder}
              name="displayOrder"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا عدد وارد کنید..."
            />
            {validation.touched.displayOrder &&
              validation.errors.displayOrder && (
                <span className="text-red-300 text-xs">
                  {validation.errors.displayOrder}
                </span>
              )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">اجباری است</span>
            <Checkbox
              checked={validation.values.isRequired}
              name="isRequired"
              onChange={(e) => {
                validation.setFieldValue("isRequired", e.target.checked);
              }}
              className="w-full"
            />
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>توضیحات</span>
            <Input.TextArea
              value={validation.values.description}
              name="description"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.description &&
              validation.errors.description && (
                <span className="text-red-300 text-xs">
                  {validation.errors.description}
                </span>
              )}
          </div>
        </Form>
      </Modal>
    </>
  );
}
