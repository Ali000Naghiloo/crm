import { Button, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UnitModal({
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
    weight: yup.string().required("لطفا این فیلد را پر کنید"),
    weightUnit: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      unitName: "",
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
      unitName: values?.unitName,
    };

    await httpService
      .post("/Unit/CreateUnit", formData)
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
    if (productId) {
      validation.setFieldValue("productId", productId);
    }
  }, [productId]);

  return (
    <div>
      <Modal
        centered
        open={open}
        onCancel={handleClose}
        title={<>تعریف واحد</>}
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
            <span>وزن :</span>
            <Input
              type="number"
              min={0}
              value={validation.values.weight}
              name="weight"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.weight && validation.errors.weight && (
              <span className="text-red-300 text-xs">
                {validation.errors.weight}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
            <span>واحد :</span>
            <Select
              options={allEnum?.WeightUnit?.map((un, index) => {
                return { label: un, value: index };
              })}
              value={validation.values.weightUnit}
              name="weightUnit"
              onChange={(e) => {
                validation.setFieldValue("weightUnit", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.weightUnit && validation.errors.weightUnit && (
              <span className="text-red-300 text-xs">
                {validation.errors.weightUnit}
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
