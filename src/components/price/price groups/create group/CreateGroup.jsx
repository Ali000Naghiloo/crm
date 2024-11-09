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
    pricingMethodGroupCode: yup.string().required("این فیلد را پر کنید"),
    pricingMethodGroupTitle: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      pricingMethodGroupCode: 0,
      pricingMethodGroupTitle: "",
      description: "",
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
      pricingMethodGroupCode: values?.pricingMethodGroupCode,
      pricingMethodGroupTitle: values?.pricingMethodGroupTitle,
      description: values?.description,
    };

    await httpService
      .post("/PricingMethodGroup/CreatePricingMethodGroup", formData)
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
        title="تعریف گروه قیمت گذاری جدید"
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
              تعریف گروه
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>عنوان گروه</span>
            <Input
              value={validation.values.pricingMethodGroupTitle}
              name="pricingMethodGroupTitle"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.pricingMethodGroupTitle &&
              validation.errors.pricingMethodGroupTitle && (
                <span className="text-error text-xs">
                  {validation.errors.pricingMethodGroupTitle}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>کد گروه قیمت گذاری</span>
            <Input
              value={validation.values.pricingMethodGroupCode}
              name="pricingMethodGroupCode"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا عدد وارد کنید..."
            />
            {validation.touched.pricingMethodGroupCode &&
              validation.errors.pricingMethodGroupCode && (
                <span className="text-error text-xs">
                  {validation.errors.pricingMethodGroupCode}
                </span>
              )}
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
                <span className="text-error text-xs">
                  {validation.errors.description}
                </span>
              )}
          </div>
        </Form>
      </Modal>
    </>
  );
}
