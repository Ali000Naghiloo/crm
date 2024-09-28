import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  Table,
  TreeSelect,
} from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import { toast } from "react-toastify";
import formatHelper from "../../../helper/formatHelper";
const { Column, ColumnGroup } = Table;

export default function UpdateGroup({ open, setOpen, getNewList, data, list }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState(null);
  const [isParent, setIsParent] = useState(false);
  const validationSchema = yup.object().shape({
    categoryName: yup.string().required("این فیلد را پر کنید"),
    // parentCategoryId: yup.number().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      productCategoryId: "",
      categoryName: "",
      description: "",
      parentCategoryId: null,
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
      productCategoryId: values?.productCategoryId,
      categoryName: values?.categoryName,
      description: values?.description,
      parentCategoryId: values?.parentCategoryId,
    };

    await httpService
      .post("/CustomerGroup/EditCustomerGroup", formData)
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
    setCategoryList(list);
  }, [list]);

  useEffect(() => {
    if (validation.values.parentCategoryId) {
      setIsParent(false);
    }
    if (!validation.values.parentCategoryId) {
      setIsParent(true);
    }
  }, [validation.values.parentCategoryId]);

  useEffect(() => {
    if (data) {
      validation.setFieldValue("productCategoryId", data?.productCategoryId);
      validation.setFieldValue("categoryName", data?.categoryName);
      validation.setFieldValue("description", data?.description);
      if (data?.parentCategoryId) {
        validation.setFieldValue("parentCategoryId", data?.parentCategoryId);
        setIsParent(false);
      } else {
        validation.setFieldValue("parentCategoryId", null);
        setIsParent(true);
      }
    }
  }, [data]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        onClose={handleClose}
        title={`ویرایش گروه : ${data ? data?.categoryName : ""}`}
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
              ویرایش گروه
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نام دسته بندی</span>
            <Input
              value={validation.values.categoryName}
              name="categoryName"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.categoryName &&
              validation.errors.categoryName && (
                <span className="text-red-300 text-xs">
                  {validation.errors.categoryName}
                </span>
              )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">دسته بندی سر گروه است؟</span>
            <Checkbox
              checked={isParent}
              name="isParent"
              onChange={(e) => {
                setIsParent(e.target.checked);
                if (e.target.checked) {
                  validation.setFieldValue("parentCategoryId", null);
                }
              }}
              className="w-full"
            />
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نام سر گروه</span>
            <TreeSelect
              treeData={categoryList}
              // treeDefaultExpandAll
              fieldNames={{
                label: "categoryName",
                value: "productCategoryId",
                children: "children",
              }}
              value={validation.values.parentCategoryId}
              onChange={(e) => {
                validation.setFieldValue("parentCategoryId", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.parentCategoryId &&
              validation.errors.parentCategoryId && (
                <span className="text-red-300 text-xs">
                  {validation.errors.parentCategoryId}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
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
