import { Button, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function PhoneModal({
  open,
  setOpen,
  mode,
  data,
  customerId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    mobileOrLandline: yup.number().required("لطفا این فیلد را پر کنید"),
    phoneNumber: yup
      .number("شما فقط از اعداد میتوانید استفاده کنید")
      .min(6, ""),
    // description: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      customerId: null,
      customerConnectorId: null,
      mobileOrLandline: 0,
      countryCode: "098",
      cityCode: "",
      phoneNumber: "",
      description: "",
    },

    validationSchema,

    onSubmit: (values) => {
      if (mode === "create") {
        handleCreate(values);
      }
      if (mode === "edit") {
        handleEdit(values);
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
      mobileOrLandline: values.mobileOrLandline,
      countryCode: values.countryCode,
      cityCode: values.cityCode,
      phoneNumber: values.phoneNumber,
      description: values.description,
      customerId: values.customerId,
      customerConnectorId: values.customerConnectorId,
    };

    await httpService
      .post("/Phone/CreatePhone", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ایجاد شد");
        }
      })
      .catch(() => {});

    handleClose();
    getNewList();
    setLoading(false);
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      id: data?.id,
      mobileOrLandline: values.mobileOrLandline,
      countryCode: values.countryCode,
      cityCode: values.cityCode,
      phoneNumber: values.phoneNumber,
      description: values.description,
      customerId: values.customerId,
      customerConnectorId: values.customerConnectorId,
    };

    await httpService
      .post("/Phone/EditPhone", formData)
      .then((res) => {})
      .catch(() => {});

    handleClose();
    getNewList();
    setLoading(false);
  };

  useEffect(() => {
    if (mode === "edit" && data) {
      validation.setFieldValue("customerId", customerId);
      // validation.setFieldValue("customerConnectorId", customerConnectorId);
      validation.setFieldValue("mobileOrLandline", data?.mobileOrLandline);
      validation.setFieldValue("countryCode", data?.countryCode);
      validation.setFieldValue("cityCode", data?.cityCode);
      validation.setFieldValue("phoneNumber", data?.phoneNumber);
      validation.setFieldValue("description", data?.description);
    }

    if (mode === "create" && customerId) {
      validation.setFieldValue("customerId", customerId);
    }
  }, [data, customerId]);

  return (
    <div>
      <Modal
        open={open}
        onCancel={handleClose}
        title={
          mode === "create" ? (
            <>تعریف شماره برای شخص</>
          ) : (
            <>ویرایش شماره تلفن {data?.phoneNumber}</>
          )
        }
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
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نوع خط :</span>
            <Select
              options={allEnum?.MobileOrLandline?.map((type, index) => {
                return { label: type, value: index };
              })}
              value={validation.values.mobileOrLandline}
              onChange={(e) => {
                validation.setFieldValue("mobileOrLandline", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.mobileOrLandline &&
              validation.errors.mobileOrLandline && (
                <span className="text-error text-xs">
                  {validation.errors.mobileOrLandline}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>کد کشور :</span>
            <Input
              value={validation.values.countryCode}
              name="countryCode"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.countryCode &&
              validation.errors.countryCode && (
                <span className="text-error text-xs">
                  {validation.errors.countryCode}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>کد شهر :</span>
            <Input
              type="tel"
              value={validation.values.cityCode}
              name="cityCode"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.cityCode && validation.errors.cityCode && (
              <span className="text-error text-xs">
                {validation.errors.cityCode}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>
              شماره{" "}
              {allEnum?.MobileOrLandline[validation.values.mobileOrLandline]} :
            </span>
            <Input
              value={validation.values.phoneNumber}
              name="phoneNumber"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.phoneNumber &&
              validation.errors.phoneNumber && (
                <span className="text-error text-xs">
                  {validation.errors.phoneNumber}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>توضیحات اضافه :</span>
            <Input.TextArea
              value={validation.values.description}
              name="description"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.description &&
              validation.errors.description && (
                <span className="text-error text-xs">
                  {validation.errors.description}
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
