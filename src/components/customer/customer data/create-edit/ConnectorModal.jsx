import { Button, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ConnectorModal({
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
    connectorName: yup.string().required("لطفا این فیلد را پر کنید"),
    // position: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      connectorId: null,
      customerId: null,
      connectorName: "",
      position: "",
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
      connectorName: values.connectorName,
      position: values.position,
      customerId: values.customerId,
    };

    await httpService
      .post("/Connector/CreateConnector", formData)
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
      connectorId: values.connectorId,
      connectorName: values.connectorName,
      position: values.position,
      customerId: values.customerId,
    };

    await httpService
      .post("/Connector/EditConnector", formData)
      .then((res) => {})
      .catch(() => {});

    handleClose();
    getNewList();
    setLoading(false);
  };

  useEffect(() => {
    if (mode === "edit" && data) {
      validation.setFieldValue("customerId", customerId);
      validation.setFieldValue("connectorId", data?.connectorId);
      validation.setFieldValue("connectorName", data?.connectorName);
      validation.setFieldValue("position", data?.position);
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
            <>تعریف رابط برای شخص</>
          ) : (
            <>{`ویرایش رابط "${data?.connectorName}"`}</>
          )
        }
        footer={
          <div className="">
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
            <span>نام رابط :</span>
            <Input
              value={validation.values.connectorName}
              name="connectorName"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.connectorName &&
              validation.errors.connectorName && (
                <span className="text-error text-xs">
                  {validation.errors.connectorName}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>موقعیت رابط :</span>
            <Input
              type="tel"
              value={validation.values.position}
              name="position"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.position && validation.errors.position && (
              <span className="text-error text-xs">
                {validation.errors.position}
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
