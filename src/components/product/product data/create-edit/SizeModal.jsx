import { Button, ColorPicker, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function SizeModal({
  open,
  setOpen,
  mode,
  data,
  productId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    sizeName: yup.string().required("لطفا این فیلد را پر کنید"),
    sizeUnit: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      productId: 0,
      sizeName: "",
      sizeUnit: 0,
      length: 0,
      width: 0,
      height: 0,
    },
    validationSchema,

    onSubmit: (values) => {
      if (mode === "create") {
        handleCreate(values);
      }
    },
  });

  const handleClose = () => {
    setOpen(false);
    validation.resetForm();
  };

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      productId: values?.productId,
      sizeName: values?.sizeName,
      sizeUnit: values?.sizeUnit,
      length: values?.length,
      width: values?.width,
      height: values?.height,
    };

    await httpService
      .post("/ProductSize/CreateProductSize", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ایجاد شد");
          handleClose();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    if (mode === "create" && productId) {
      validation.setFieldValue("productId", productId);
    }
  }, [productId]);

  return (
    <div>
      <Modal
        open={open}
        onCancel={handleClose}
        title={<>ساخت اندازه برای محصول</>}
        footer={
          <div>
            <Button type="primary" danger onClick={handleClose}>
              لغو
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-3 pt-4"
        >
          <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
            <span>نام اندازه :</span>
            <Input
              value={validation.values.sizeName}
              name="sizeName"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.sizeName && validation.errors.sizeName && (
              <span className="text-red-300 text-xs">
                {validation.errors.sizeName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
            <span>واحد اندازه :</span>
            <Select
              options={allEnum?.SizeUnit?.map((unit, index) => {
                return { label: unit, value: index };
              })}
              value={validation.values.sizeUnit}
              name="sizeUnit"
              onChange={(e) => {
                validation.setFieldValue("sizeUnit", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.sizeUnit && validation.errors.sizeUnit && (
              <span className="text-red-300 text-xs">
                {validation.errors.sizeUnit}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start mx-auto">
            <span> طول :</span>
            <Input
              type="number"
              min={0}
              value={validation.values.height}
              name="height"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.height && validation.errors.height && (
              <span className="text-red-300 text-xs">
                {validation.errors.height}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start mx-auto">
            <span> عرض :</span>
            <Input
              type="number"
              min={0}
              value={validation.values.width}
              name="width"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.width && validation.errors.width && (
              <span className="text-red-300 text-xs">
                {validation.errors.width}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
            <span> تعداد :</span>
            <Input
              type="number"
              min={0}
              value={validation.values.length}
              name="length"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.length && validation.errors.length && (
              <span className="text-red-300 text-xs">
                {validation.errors.length}
              </span>
            )}
          </div>

          {/* submit button */}
          <div className="w-full flex justify-center py-10">
            <Button
              type="primary"
              loading={loading}
              disabled={loading}
              htmlType="submit"
            >
              ثبت
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
