import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function CreateGroup({ open, setOpen, getNewList, list }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    customerGroupType: yup.string().required("این فیلد را پر کنید"),
    title: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      customerGroupType: null,
      title: "",
      description: "",
      customerGroupCustomers: null,
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      validation.resetForm();
    }
  };

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      customerGroupType: values?.customerGroupType,
      title: values?.title,
      description: values?.description,
      customerGroupCustomers: values?.customerGroupCustomers
        ? values.customerGroupCustomers?.map((cu) => {
            return { customerId: cu };
          })
        : [],
    };

    await httpService
      .post("/CustomerGroup/CreateCustomerGroup", formData)
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
    if (
      customerList &&
      validation.values.customerGroupCustomers?.length === customerList?.length
    ) {
      setSelectAll(true);
    }
    if (
      validation.values.customerGroupCustomers?.length !== customerList?.length
    ) {
      setSelectAll(false);
    }
  }, [validation.values.customerGroupCustomers]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        onClose={handleClose}
        title="تعریف گروه جدید"
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
              تعریف گروه
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نوع گروه اشخاص</span>
            <Select
              options={allEnum?.CustomerGroupType?.map((type, index) => {
                return { label: type, value: index };
              })}
              value={validation.values.customerGroupType}
              onChange={(e) => {
                validation.setFieldValue("customerGroupType", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.customerGroupType &&
              validation.errors.customerGroupType && (
                <span className="text-red-300 text-xs">
                  {validation.errors.customerGroupType}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نام گروه اشخاص</span>
            <Input
              value={validation.values.title}
              name="title"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.title && validation.errors.title && (
              <span className="text-red-300 text-xs">
                {validation.errors.title}
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
              value={validation.values.customerGroupCustomers}
              onChange={(e) => {
                validation.setFieldValue("customerGroupCustomers", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.customerGroupCustomers &&
              validation.errors.customerGroupCustomers && (
                <span className="text-red-300 text-xs">
                  {validation.errors.customerGroupCustomers}
                </span>
              )}
            <div>
              <span>انتخاب همه اشخاص : </span>
              <Checkbox
                checked={selectAll}
                defaultChecked={selectAll}
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
