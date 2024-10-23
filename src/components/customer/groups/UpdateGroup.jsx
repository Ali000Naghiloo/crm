import { Button, Checkbox, Form, Input, Modal, Select, TreeSelect } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function UpdateGroup({ open, setOpen, getNewList, data }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    groupName: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      id: 0,
      groupName: "",
      description: "",
      parentGroupId: null,
      customersGroups: [],
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
      ...values,
      id: values?.id,
      customersGroups:
        values?.customersGroups && values?.customersGroups?.length !== 0
          ? values?.customersGroups?.map((i) => {
              return {
                customerId: i,
              };
            })
          : [],
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

  const handleGetCustomerList = async () => {
    setLoading(true);
    let datas = [];

    await httpService
      .get("/Customer/GetAllCustomers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.customerList?.map((cu) => {
            datas.push({ label: cu.customerName, value: cu.customerId });
          });
        }
      })
      .catch(() => {});

    setCustomerList(datas);
    setLoading(false);
  };

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      validation.setFieldValue(
        "customerGroupCustomers",
        customerList?.map((cu) => cu?.value)
      );
      setSelectAll(true);
    }
  };

  useEffect(() => {
    handleGetCustomerList();
  }, []);

  useEffect(() => {
    if (data) {
      validation.setFieldValue("id", data?.id);
      validation.setFieldValue("groupName", data?.groupName);
      validation.setFieldValue("parentGroupId", data?.parentGroupId);
      validation.setFieldValue(
        "customersGroups",
        data?.customersGroups?.map((data) => data?.customerId)
      );
      validation.setFieldValue("description", data?.description);
    }
  }, [data]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        onClose={handleClose}
        title={`ویرایش گروه : ${data ? data?.title : ""}`}
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
            <span>نام گروه اشخاص</span>
            <Input
              value={validation.values.groupName}
              name="groupName"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.groupName && validation.errors.groupName && (
              <span className="text-red-300 text-xs">
                {validation.errors.groupName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>اشخاص این گروه</span>
            <Select
              allowClear
              mode="multiple"
              maxTagCount={3}
              options={customerList}
              value={validation.values.customersGroups}
              onChange={(e) => {
                validation.setFieldValue("customersGroups", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.customersGroups &&
              validation.errors.customersGroups && (
                <span className="text-red-300 text-xs">
                  {validation.errors.customersGroups}
                </span>
              )}
            <div>
              <span>انتخاب همه اشخاص : </span>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
              ></Checkbox>
            </div>
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>گروه والد</span>
            <TreeSelect
              allowClear
              mode="multiple"
              maxTagCount={3}
              options={customerList}
              value={validation.values.customersGroups}
              onChange={(e) => {
                validation.setFieldValue("customersGroups", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.customersGroups &&
              validation.errors.customersGroups && (
                <span className="text-red-300 text-xs">
                  {validation.errors.customersGroups}
                </span>
              )}
            <div>
              <span>انتخاب همه اشخاص : </span>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
              ></Checkbox>
            </div>
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
