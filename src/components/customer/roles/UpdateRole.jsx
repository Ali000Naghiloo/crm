import {
  Button,
  Cascader,
  Checkbox,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  TreeSelect,
} from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import { toast } from "react-toastify";

export default function UpdateRole({ open, setOpen, getNewList, data }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    roleName: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      customerRoleId: 0,
      roleName: "",
      description: "",
      parentCustomerRoleId: null,
    },
    validationSchema,
    onSubmit: (values) => {
      handleEdit(values);
    },
  });

  const handleClose = () => {
    if (!loading) {
      validation.resetForm();
      setOpen(false);
    }
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      customerRoleId: values?.customerRoleId,
      ...values,
    };

    await httpService
      .post("/CustomerRole/EditCustomerRoles", formData)
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
      validation.setFieldValue("customerRoleId", data.customerRoleId);
      validation.setFieldValue("roleName", data.roleName);
      validation.setFieldValue("description", data.description);
    }
  }, [data]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        title={`ویرایش نقش : ${data ? data?.roleName : ""}`}
        loading={data ? false : true}
        footer={
          <div className="w-full flex gap-3 justify-end pt-5">
            <div className="flex gap-2">
              <Button type="primary" danger onClick={handleClose}>
                لغو
              </Button>
              <Button
                onClick={validation.submitForm}
                type="primary"
                disabled={loading}
                loading={loading}
              >
                ویرایش نقش
              </Button>
            </div>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نام نقش</span>
            <Input
              value={validation.values.roleName}
              name="roleName"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.roleName && validation.errors.roleName && (
              <span className="text-error text-xs">
                {validation.errors.roleName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto pt-10">
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
