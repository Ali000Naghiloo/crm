import { Button, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function NoteModal({
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
    // customerId: null,
    // customerConnectorId: 0,
    note: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      note: "",
      customerId: null,
      customerConnectorId: 0,
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
      customerId: values.customerId,
      customerConnectorId: values.customerConnectorId,
      note: values.note,
    };

    await httpService
      .post("/Note/CreateNote", formData)
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
      customerId: values.customerId,
      customerConnectorId: values.customerConnectorId,
      note: values.note,
    };

    await httpService
      .post("/Note/EditNote", formData)
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
      validation.setFieldValue("note", data?.note);
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
            <>تعریف یادداشت برای شخص</>
          ) : (
            <>ویرایش یادداشت {data?.phoneNumber}</>
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
          <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
            <span>متن یادداشت :</span>
            <Input.TextArea
              rows={10}
              value={validation.values.note}
              name="note"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.note && validation.errors.note && (
              <span className="text-red-300 text-xs">
                {validation.errors.note}
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
