import {
  Button,
  Cascader,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  TreeSelect,
} from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import { toast } from "react-toastify";

export default function CreateRole({ open, setOpen, getNewList, list }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [isParent, setIsParent] = useState(false);
  const [roleList, setRoleList] = useState(null);

  const validationSchema = yup.object().shape({
    roleName: yup.string().required("این فیلد را پر کنید"),
    // parentCustomerRoleId: yup.number().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      roleName: "",
      description: "",
      parentCustomerRoleId: null,
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const handleClose = () => {
    if (!loading) {
      validation.resetForm();
      setOpen(false);
    }
  };

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      roleName: values?.roleName,
      description: values?.description,
      parentCustomerRoleId: values?.parentCustomerRoleId
        ? values?.parentCustomerRoleId
        : null,
    };

    await httpService
      .post("/CustomerRole/CreateCustomerRoles", formData)
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
    setRoleList(list);
  }, [list]);

  useEffect(() => {
    if (validation.values.parentCustomerRoleId) {
      setIsParent(false);
    }
    if (!validation.values.parentCustomerRoleId) {
      setIsParent(true);
    }
  }, [validation.values.parentCustomerRoleId]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        title="تعریف نقش جدید"
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
              تعریف نقش
            </Button>
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
              <span className="text-red-300 text-xs">
                {validation.errors.roleName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">نقش سرگروه است؟</span>
            <Checkbox
              checked={isParent}
              name="isParent"
              onChange={(e) => {
                if (e.target.checked) {
                  validation.setFieldValue("parentCustomerRoleId", null);
                  setIsParent(e.target.checked);
                }
              }}
              className="w-full"
            />
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نام سرگروه</span>
            <TreeSelect
              treeData={roleList}
              // treeDefaultExpandAll
              fieldNames={{
                label: "roleName",
                value: "customerRoleId",
                children: "children",
              }}
              value={validation.values.parentCustomerRoleId}
              onChange={(e) => {
                validation.setFieldValue("parentCustomerRoleId", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.parentCustomerRoleId &&
              validation.errors.parentCustomerRoleId && (
                <span className="text-red-300 text-xs">
                  {validation.errors.parentCustomerRoleId}
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
