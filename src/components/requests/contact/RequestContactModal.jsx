import { Button, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "jalali-moment";
import MyDatePicker from "../../../common/MyDatePicker";

export default function RequestContactModal({
  open,
  setOpen,
  mode,
  data,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState(null);
  const [titleList, setTitleList] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    customer: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      code: 0,
      date: moment().utc().locale("fa"),
      customerId: null,
      customer: "",
      initialRequestItems: null,
      customerInitialRequestResponsibles: null,
      customeRequestStatus: 0,
      description: "",
    },

    validationSchema,

    onSubmit: (values) => {
      console.log(data);
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
      customerInitialRequestResponsibles:
        values?.customerInitialRequestResponsibles
          ? values?.customerInitialRequestResponsibles.map((res) => {
              return { userId: res };
            })
          : [],
      initialRequestItems: values?.initialRequestItems
        ? [
            {
              itemRow: 0,
              initialRequestId: values?.initialRequestItems,
              description: "",
            },
          ]
        : [],
    };

    await httpService
      .post("/CustomerInitialRequest/CreateInitialRequest", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ایجاد شد");
          handleClose();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
      customerInitialRequestResponsibles:
        values?.customerInitialRequestResponsibles
          ? values?.customerInitialRequestResponsibles.map((res) => {
              return { userId: res };
            })
          : [],
      initialRequestItems: values?.initialRequestItems
        ? [
            {
              itemRow: 0,
              initialRequestId: values?.initialRequestItems,
              description: "",
            },
          ]
        : [],
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

    setLoading(false);
  };

  // get lists
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
  const handleGetEmployeesList = async () => {
    let datas = [];

    await httpService
      .get("/Account/GetAllUsers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.data?.map((pr) => {
            datas.push({
              value: pr?.id,
              label: pr?.fullName,
            });
          });
        }
      })
      .catch(() => {});

    setUsersList(datas);
  };
  const handleGetTitleList = async () => {
    let datas = [];

    await httpService
      .get("/InitialRequest/GetAllInitialRequest")
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          datas = res.data?.initialRequestViewModelList;
        }
      })
      .catch(() => {});

    setTitleList(datas);
  };

  const handleGetCode = async () => {
    await httpService
      .get("/CustomerInitialRequest/InitialRequestCode")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          validation.setFieldValue("code", res.data?.initialRequestNumber);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (data) {
      console.log(data?.initialRequestItems);
      validation.setFieldValue("id", data?.id);
      validation.setFieldValue("customer", data?.customer);
      validation.setFieldValue("customerId", data?.customerId);
      validation.setFieldValue(
        "customerInitialRequestResponsibles",
        data?.customerInitialRequestResponsibles
          ? data?.customerInitialRequestResponsibles?.map((us) => {
              return { label: us?.user, value: us?.userId };
            })
          : []
      );
      validation.setFieldValue(
        "initialRequestItems",
        data?.initialRequestItems
          ? data?.initialRequestItems[0]?.initialRequestId
          : null
      );
    }
  }, [data]);

  useEffect(() => {
    handleGetCode();
  }, [open]);

  useEffect(() => {
    handleGetCustomerList();
    handleGetEmployeesList();
    handleGetTitleList();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onCancel={handleClose}
        title={
          !data ? (
            <>فرم ثبت درخواست تماس اولیه</>
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
        className=""
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-3 pt-4"
        >
          <div className="flex flex-wrap gap-5">
            <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
              <span>تاریخ :</span>
              <MyDatePicker
                value={validation.values.date}
                setValue={(e) => {
                  validation.setFieldValue("date", e);
                }}
                className="w-[420px]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.date && validation.errors.date && (
                <span className="text-red-300 text-xs">
                  {validation.errors.date}
                </span>
              )}
            </div>

            <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
              <span>شخص :</span>
              <Select
                loading={customerList ? false : true}
                options={customerList}
                value={validation.values.customerId}
                name="customerId"
                onChange={(e, event) => {
                  console.log(event);
                  validation.setFieldValue("customerId", event?.value);
                  validation.setFieldValue("customer", event?.label);
                }}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.customerId &&
                validation.errors.customerId && (
                  <span className="text-red-300 text-xs">
                    {validation.errors.customerId}
                  </span>
                )}
            </div>

            <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
              <span>عنوان درخواست :</span>
              <Select
                fieldNames={{ label: "name", value: "id" }}
                options={titleList}
                value={validation.values.initialRequestItems}
                name="initialRequestItems"
                onChange={(e, event) => {
                  console.log(event);
                  validation.setFieldValue("initialRequestItems", event?.id);
                  validation.setFieldValue("customer", event?.name);
                }}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.initialRequestItems &&
                validation.errors.initialRequestItems && (
                  <span className="text-red-300 text-xs">
                    {validation.errors.initialRequestItems}
                  </span>
                )}
            </div>

            <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
              <span>مسئول پیگیری درخواست :</span>
              <Select
                mode="multiple"
                optionFilterProp="label"
                options={usersList}
                value={validation.values.customerInitialRequestResponsibles}
                name="customerInitialRequestResponsibles"
                onChange={(e, event) => {
                  validation.setFieldValue(
                    "customerInitialRequestResponsibles",
                    e
                  );
                }}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.customerInitialRequestResponsibles &&
                validation.errors.customerInitialRequestResponsibles && (
                  <span className="text-red-300 text-xs">
                    {validation.errors.customerInitialRequestResponsibles}
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
                <span className="text-red-300 text-xs">
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
                  <span className="text-red-300 text-xs">
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
