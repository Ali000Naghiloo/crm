import { Button, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function RequestContactModal({
  open,
  setOpen,
  mode,
  data,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    name: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      code: 0,
      name: "",
      description: "",
    },
    validationSchema,

    onSubmit: (values) => {
      if (!data) {
        handleCreate(values);
      } else {
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
      ...values,
    };

    await httpService
      .post("/InitialRequest/CreateInitialRequest", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ایجاد شد");
          handleClose();
          getNewList();
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
      ...values,
      id: data?.id,
    };

    await httpService
      .post("/InitialRequest/EditInitialRequest", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ویرایش شد");
          handleClose();
          getNewList();
        }
      })
      .catch(() => {});

    handleClose();
    getNewList();
    setLoading(false);
  };

  useEffect(() => {
    console.log("hello");
    if (data) {
      validation.setFieldValue("id", data?.id);
      validation.setFieldValue("name", data?.name);
      validation.setFieldValue("code", data?.code);
      validation.setFieldValue("description", data?.description);
    }
  }, [data]);

  return (
    <div>
      <Modal
        open={open}
        onCancel={handleClose}
        title={
          !data ? (
            <>ثبت درخواست تماس اولیه</>
          ) : (
            <>ویرایش درخواست تماس اولیه {data?.name}</>
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
          <div className="flex flex-wrap gap-5">
            <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
              <span>عنوان درخواست :</span>
              <Input
                value={validation.values.name}
                name="name"
                onChange={validation.handleChange}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.name && validation.errors.name && (
                <span className="text-error text-xs">
                  {validation.errors.name}
                </span>
              )}
            </div>

            <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
              <span>کد درخواست :</span>
              <Input
                value={validation.values.code}
                name="code"
                onChange={validation.handleChange}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.code && validation.errors.code && (
                <span className="text-error text-xs">
                  {validation.errors.code}
                </span>
              )}
            </div>

            <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
              <span>توضیحات درخواست :</span>
              <Input.TextArea
                rows={10}
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
