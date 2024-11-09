import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../hooks/useHttps";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function FactorSettingData({ data, open, setOpen, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({});

  const validation = useFormik({
    initialValues: {
      factorSettingId: null,
      isFactorResponsibleEnabled: null,
      isFactorItemResponsibleEnabled: null,
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
      factorSettingId: values?.factorSettingId,
      isFactorResponsibleEnabled: values?.isFactorResponsibleEnabled,
      isFactorItemResponsibleEnabled: values?.isFactorItemResponsibleEnabled,
    };

    await httpService
      .post("/FactorResponsibleSetting/EditFactorSetting", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ویرایش شد");
          handleClose();
        }
      })
      .catch(() => {});

    getNewList();
    setLoading(false);
  };

  useEffect(() => {
    if (data) {
      validation.setFieldValue("factorSettingId", data?.factorSettingId);
      validation.setFieldValue("factorType", data?.factorType);
      validation.setFieldValue(
        "isFactorResponsibleEnabled",
        data?.isFactorResponsibleEnabled
      );
      validation.setFieldValue(
        "isFactorItemResponsibleEnabled",
        data?.isFactorItemResponsibleEnabled
      );
    }
  }, [data, open]);

  return (
    <>
      <Modal
        centered
        open={open}
        onCancel={handleClose}
        onClose={handleClose}
        title="تنظیمات فاکتور"
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
              ویرایش
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          {/* <div className="flex gap-1 flex-col items-start w-full mx-auto">
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
          </div> */}

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>مسئول فاکتور مشخص شود؟</span>
            <Checkbox
              value={validation.values.isFactorResponsibleEnabled}
              name="isFactorResponsibleEnabled"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.isFactorResponsibleEnabled &&
              validation.errors.isFactorResponsibleEnabled && (
                <span className="text-error text-xs">
                  {validation.errors.isFactorResponsibleEnabled}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>مسئول کالا و خدمات ها فاکتور مشخص شود؟</span>
            <Checkbox
              value={validation.values.isFactorItemResponsibleEnabled}
              name="isFactorItemResponsibleEnabled"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.isFactorItemResponsibleEnabled &&
              validation.errors.isFactorItemResponsibleEnabled && (
                <span className="text-error text-xs">
                  {validation.errors.isFactorItemResponsibleEnabled}
                </span>
              )}
          </div>
        </Form>
      </Modal>
    </>
  );
}
