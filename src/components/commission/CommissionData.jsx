import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../hooks/useHttps";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function CreateCommission({ data, open, setOpen, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    factorType: yup.number().required("این فیلد را پر کنید"),
    commissionPercent: yup.number().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      id: null,
      factorType: 0,
      commissionPercent: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      handleEdit(values);
    },
  });

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      validation.resetForm();
    }
  };
  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      id: data?.id,
      factorType: values?.factorType,
      commissionPercent: values?.commissionPercent,
    };

    await httpService
      .post("/CommissionRate/EditCommissionRate", formData)
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

  useEffect(() => {
    if (data) {
      validation.setFieldValue("id", data?.id);
      validation.setFieldValue("factorType", data?.factorType);
      validation.setFieldValue("commissionPercent", data?.commissionPercent);
    }
  }, [data]);

  return (
    <>
      <Modal
        centered
        open={open}
        onCancel={handleClose}
        onClose={handleClose}
        title="تعریف پورسانت جدید"
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
              تعریف پورسانت
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نوع فاکتور (برای چه نوع فاکتوری اعمال شود)</span>
            <Select
              optionFilterProp="label"
              options={allEnum?.FactorType?.map((i, index) => {
                return { label: i, value: index };
              })}
              value={validation.values.factorType}
              name="factorType"
              onChange={(e) => {
                validation.setFieldValue("factorType", e);
              }}
              className="w-full"
              placeholder="لطفا عدد وارد کنید..."
            />
            {validation.touched.factorType && validation.errors.factorType && (
              <span className="text-error text-xs">
                {validation.errors.factorType}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>درصد پورسانت</span>
            <Input
              type="number"
              value={validation.values.commissionPercent}
              name="commissionPercent"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.commissionPercent &&
              validation.errors.commissionPercent && (
                <span className="text-error text-xs">
                  {validation.errors.commissionPercent}
                </span>
              )}
          </div>
        </Form>
      </Modal>
    </>
  );
}
