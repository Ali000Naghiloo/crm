import { Button, Form, Input, Modal } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp, { baseURL } from "../../../hooks/useHttps";
import { toast } from "react-toastify";

export default function CreateGroup({ open, setOpen, getNewList, list }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    ProductManufacturerCode: yup.string().required("این فیلد را پر کنید"),
    Name: yup.string().required("این فیلد را پر کنید"),
    LatinName: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      ProductManufacturerCode: "",
      Name: "",
      LatinName: "",
      Description: "",
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
      ProductManufacturerCode: values?.ProductManufacturerCode,
      Name: values?.Name,
      LatinName: values?.LatinName,
      Description: values?.Description,
    };

    await httpService
      .post("/Manufacturer/CreateManufacturer", formData)
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

  useEffect(() => {}, []);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        onClose={handleClose}
        title="تعریف سازنده جدید"
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
              تعریف سازنده
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نام شرکت سازنده</span>
            <Input
              value={validation.values.Name}
              name="Name"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.Name && validation.errors.Name && (
              <span className="text-red-300 text-xs">
                {validation.errors.Name}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نام لاتین</span>
            <Input
              value={validation.values.LatinName}
              name="LatinName"
              LatinName
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.LatinName && validation.errors.LatinName && (
              <span className="text-red-300 text-xs">
                {validation.errors.LatinName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>کد شرکت سازنده</span>
            <Input
              value={validation.values.ProductManufacturerCode}
              name="ProductManufacturerCode"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.ProductManufacturerCode &&
              validation.errors.ProductManufacturerCode && (
                <span className="text-red-300 text-xs">
                  {validation.errors.ProductManufacturerCode}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>توضیحات</span>
            <Input.TextArea
              value={validation.values.Description}
              name="Description"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.Description &&
              validation.errors.Description && (
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
