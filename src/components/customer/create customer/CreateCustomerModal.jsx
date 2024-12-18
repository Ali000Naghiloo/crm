import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import MyDatePicker from "../../../common/MyDatePicker";
import { toast } from "react-toastify";

export default function CreateCustomerModal({ open, setOpen, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [representList, setRepresentList] = useState([]);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    customerType: yup.string().required("این فیلد را پر کنید"),
    // customerCod: yup.string().required("این فیلد را پر کنید"),
    // startDateTime: yup.string().required("این فیلد را پر کنید"),
    // endDateTime: yup.string().required("این فیلد را پر کنید"),
    // nickName: yup.string().required("این فیلد را پر کنید"),
    // description: yup.string().required("این فیلد را پر کنید"),
    isActive: null,
    // representerName: yup.string().required("این فیلد را پر کنید"),
    userName: yup.string().required("این فیلد را پر کنید"),
    password: yup.string().required("این فیلد را پر کنید"),
    nationalID: yup.number("لطفا از اعداد استفاده کنید"),
  });

  const validation = useFormik({
    initialValues: {
      // common fields
      customerType: 0,
      customerId: "",
      userName: "",
      password: "",
      customerCod: "",
      startDateTime: null,
      endDateTime: null,
      nickName: "",
      description: "",
      isActive: true,
      representerType: null,
      representerId: null,
      nationalID: "",
      // person fields
      firstName: "",
      lastName: "",
      customerSex: "",
      birthdayDateTime: "",
      maritalStatus: "",
      numberOfChildren: "",
      nameOfPartner: "",
      // company fields
      customerName: "",
      companyType: null,
      economicCode: "",
      registrationDateTime: "",
      registrationNumber: "",
    },

    validationSchema,

    onSubmit: (values) => {
      handleCreateCustomer(values);
    },
  });

  const handleClose = () => {
    if (!loading) {
      validation.resetForm();
      setOpen(false);
    }
  };

  const handleGetCustomerCode = async () => {
    await httpService
      .get("/Customer/CustomerCod")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          validation.setFieldValue("customerCod", res.data?.customerCod);
        }
      })
      .catch(() => {
        return null;
      });
  };

  const handleCreateCustomer = async (values) => {
    setLoading(true);
    const formData = {
      customerType: values?.customerType,
      customerCod: values?.customerCod,
      customerName: values.customerType == 1 ? values?.customerName : "string",
      startDateTime: values?.startDateTime,
      endDateTime: values?.endDateTime,
      nickName: values?.nickName,
      description: values?.description,
      isActive: values?.isActive,
      representerType: values?.representerType,
      representerId: values?.representerId,
      representerName: values?.representerName,
      nationalID: `${values?.nationalID}`,
      // person fields
      firstName: values?.firstName ? values?.firstName : "",
      lastName: values?.lastName ? values?.lastName : "",
      customerSex: values?.customerSex ? values.customerSex : 0,
      birthdayDateTime: values?.birthdayDateTime
        ? values?.birthdayDateTime
        : null,
      maritalStatus: values?.maritalStatus ? values.maritalStatus : 0,
      numberOfChildren: values?.numberOfChildren ? values.numberOfChildren : 0,
      nameOfPartner: values?.nameOfPartner ? values?.nameOfPartner : "",
      // company fields
      companyType: values?.customerType ? values?.customerType : 0,
      economicCode: values?.economicCode ? values?.economicCode : "",
      registrationDateTime: values?.registrationDateTime
        ? values?.registrationDateTime
        : null,
      registrationNumber: values?.registrationNumber
        ? values?.registrationNumber
        : null,
    };

    await httpService
      .post("/Customer/CreateCustomer", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("شخص با موفقیت تعریف شد");
          handleClose();
        }
      })
      .catch(() => {});

    getNewList();
    setLoading(false);
  };

  const handleRenderFieldByCustomerType = (type) => {
    // حقیقی
    if (type === 0) {
      return (
        <>
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نام :</span>
            <Input
              value={validation.values.firstName}
              name="firstName"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.firstName && validation.errors.firstName && (
              <span className="text-error text-xs">
                {validation.errors.firstName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نام خانوادگی :</span>
            <Input
              value={validation.values.lastName}
              name="lastName"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.lastName && validation.errors.lastName && (
              <span className="text-error text-xs">
                {validation.errors.lastName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>تاریخ تولد :</span>
            <MyDatePicker
              value={validation.values.birthdayDateTime}
              setValue={(e) => {
                validation.setFieldValue("birthdayDateTime", e);
              }}
              className={"w-[300px]"}
            />
            {validation.touched.birthdayDateTime &&
              validation.errors.birthdayDateTime && (
                <span className="text-error text-xs">
                  {validation.errors.birthdayDateTime}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>کد ملی :</span>
            <Input
              type="number"
              value={validation.values.nationalID}
              name="nationalID"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.nationalID && validation.errors.nationalID && (
              <span className="text-error text-xs">
                {validation.errors.nationalID}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>جنسیت :</span>
            <Select
              options={allEnum?.CustomerSex?.map((gen, index) => {
                return { label: gen, value: index };
              })}
              value={validation.values.customerSex}
              onChange={(e) => {
                validation.setFieldValue("customerSex", e);
              }}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
              placement="انتخاب کنید"
            />
            {validation.touched.customerSex &&
              validation.errors.customerSex && (
                <span className="text-error text-xs">
                  {validation.errors.customerSex}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>وضعیت تاهل :</span>
            <Select
              options={[
                { label: "مجرد", value: 0 },
                { label: "متاهل", value: 1 },
              ]}
              value={validation.values.maritalStatus}
              onChange={(e) => {
                validation.setFieldValue("maritalStatus", e);
              }}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.maritalStatus &&
              validation.errors.maritalStatus && (
                <span className="text-error text-xs">
                  {validation.errors.maritalStatus}
                </span>
              )}
          </div>

          {validation.values.maritalStatus ? (
            <>
              <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
                <span>نام همسر :</span>
                <Input
                  value={validation.values.nameOfPartner}
                  name="nameOfPartner"
                  onChange={validation.handleChange}
                  className="w-full"
                  placeholder="لطفا اینجا وارد کنید..."
                />
                {validation.touched.nameOfPartner &&
                  validation.errors.nameOfPartner && (
                    <span className="text-error text-xs">
                      {validation.errors.nameOfPartner}
                    </span>
                  )}
              </div>

              <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
                <span>تعداد فرزندان :</span>
                <Input
                  min={0}
                  type="number"
                  value={validation.values.numberOfChildren}
                  name="numberOfChildren"
                  onChange={validation.handleChange}
                  className="w-full"
                  placeholder="لطفا اینجا وارد کنید..."
                />
                {validation.touched.numberOfChildren &&
                  validation.errors.numberOfChildren && (
                    <span className="text-error text-xs">
                      {validation.errors.numberOfChildren}
                    </span>
                  )}
              </div>
            </>
          ) : null}
        </>
      );
    }
    // حقوقی
    if (type === 1) {
      return (
        <>
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نام شرکت :</span>
            <Input
              value={validation.values.customerName}
              onChange={validation.handleChange}
              name="customerName"
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.customerName &&
              validation.errors.customerName && (
                <span className="text-error text-xs">
                  {validation.errors.customerName}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نوع شرکت :</span>
            <Select
              options={allEnum?.CompanyType?.map((ct, index) => {
                return { label: ct, value: index };
              })}
              value={validation.values.companyType}
              onChange={(e) => {
                validation.setFieldValue("companyType", e);
              }}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.companyType &&
              validation.errors.companyType && (
                <span className="text-error text-xs">
                  {validation.errors.companyType}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>تاریخ ثبت شرکت :</span>
            <MyDatePicker
              value={validation.values.registrationDateTime}
              setValue={(e) => {
                validation.setFieldValue("registrationDateTime", e);
              }}
              className="w-[300px]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.companyType &&
              validation.errors.companyType && (
                <span className="text-error text-xs">
                  {validation.errors.companyType}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>کد اقتصادی :</span>
            <Input
              value={validation.values.economicCode}
              onChange={validation.handleChange}
              name="economicCode"
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.economicCode &&
              validation.errors.economicCode && (
                <span className="text-error text-xs">
                  {validation.errors.economicCode}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>شناسه ملی :</span>
            <Input
              value={validation.values.nationalID}
              name="nationalID"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.nationalID && validation.errors.nationalID && (
              <span className="text-error text-xs">
                {validation.errors.nationalID}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>شماره ثبت شرکت :</span>
            <Input
              value={validation.values.companyType}
              onChange={validation.handleChange}
              name="companyType"
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.companyType &&
              validation.errors.companyType && (
                <span className="text-error text-xs">
                  {validation.errors.companyType}
                </span>
              )}
          </div>
        </>
      );
    }
  };

  // handle represent
  const handleGetRepresenterList = async () => {
    let datas = [];
    setRepresentList(null);

    if (validation.values.representerType === 0) {
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
    }

    if (validation.values.representerType === 1) {
      await httpService
        .get("/CustomerGroup/CustomerGroups")
        .then((res) => {
          if (res.status === 200 && res.data?.code === 1) {
            res.data?.customerGroupViewModelList?.map((cu) => {
              datas.push({ label: cu.groupName, value: cu.id });
            });
          }
        })
        .catch(() => {});
    }

    setRepresentList(datas);
  };

  const handleShowRepresentList = () => {
    // توسط شخص
    if (validation.values.representerType === 0) {
      return (
        <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
          <span>معرف :</span>
          <Select
            loading={representList ? false : true}
            options={representList}
            value={validation.values.representerId}
            name="representerId"
            onChange={(e) => {
              validation.setFieldValue("representerId", e);
            }}
            className="w-[100%]"
            placeholder="لطفا اینجا وارد کنید..."
          />
          {validation.touched.representerId &&
            validation.errors.representerId && (
              <span className="text-error text-xs">
                {validation.errors.representerId}
              </span>
            )}
        </div>
      );
    }
    // توسط گروه شخص ها
    if (validation.values.representerType === 1) {
      return (
        <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
          <span>معرف :</span>
          <Select
            loading={representList ? false : true}
            options={representList}
            value={validation.values.representerId}
            name="representerId"
            onChange={(e) => {
              validation.setFieldValue("representerId", e);
            }}
            className="w-[100%]"
            placeholder="لطفا اینجا وارد کنید..."
          />
          {validation.touched.representerId &&
            validation.errors.representerId && (
              <span className="text-error text-xs">
                {validation.errors.representerId}
              </span>
            )}
        </div>
      );
    }
    // else way
    else {
      return <></>;
    }
  };

  useEffect(() => {
    handleGetRepresenterList();
  }, [validation.values.representerType]);

  useEffect(() => {
    if (open) handleGetCustomerCode();
  }, [open]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        title="تعریف شخص جدید"
        className="!w-fit max-w-[1000px]"
        footer={
          <div className="flex justify-end gap-3 pt-5">
            <Button onClick={handleClose} type="primary" danger>
              لغو
            </Button>
            <Button
              onClick={validation.handleSubmit}
              type="primary"
              loading={loading}
              disabled={loading}
            >
              ثبت شخص جدید
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نوع شخص</span>
            <Select
              options={allEnum?.CustomerType?.map((type, index) => {
                return { label: type, value: index };
              })}
              value={validation.values.customerType}
              onChange={(e) => {
                validation.setFieldValue("customerType", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.customerType &&
              validation.errors.customerType && (
                <span className="text-error text-xs">
                  {validation.errors.customerType}
                </span>
              )}
          </div>

          {handleRenderFieldByCustomerType(validation.values.customerType)}

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>تاریخ شروع همکاری :</span>
            <MyDatePicker
              value={validation.values.startDateTime}
              setValue={(e) => {
                validation.setFieldValue("startDateTime", e);
                console.log(e);
              }}
              className={"w-[300px]"}
              status={
                validation.touched.startDateTime &&
                validation.errors.startDateTime &&
                "error"
              }
            />
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>تاریخ پایان همکاری :</span>
            <MyDatePicker
              value={validation.values.endDateTime}
              setValue={(e) => {
                validation.setFieldValue("endDateTime", e);
              }}
              className={"w-[300px]"}
              status={
                validation.touched.endDateTime &&
                validation.errors.endDateTime &&
                "error"
              }
            />
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>اسم مستعار :</span>
            <Input
              value={validation.values.nickName}
              name="nickName"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.nickName && validation.errors.nickName && (
              <span className="text-error text-xs">
                {validation.errors.nickName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>توضیحات :</span>
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

          <div className="w-full flex pt-10">
            <div className="flex gap-1 flex-col items-start w-[300px] mx-auto ">
              <span>نام کاربری</span>
              <Input
                value={validation.values.userName}
                onChange={(e) => {
                  validation.setFieldValue("userName", e.target.value);
                }}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.userName && validation.errors.userName && (
                <span className="text-error text-xs">
                  {validation.errors.userName}
                </span>
              )}
            </div>
          </div>

          <div className="w-full flex">
            <div className="flex gap-1 flex-col items-start w-[300px] mx-auto ">
              <span>رمز عبور</span>
              <Input
                value={validation.values.password}
                onChange={(e) => {
                  validation.setFieldValue("password", e.target.value);
                }}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.password && validation.errors.password && (
                <span className="text-error text-xs">
                  {validation.errors.password}
                </span>
              )}
            </div>
          </div>

          <div className="w-full flex pt-10">
            <div className="flex gap-1 flex-col items-start w-[300px] mx-auto ">
              <span>نوع معرف : (اگر شخص معرف دارد این فیلد را پر کنید)</span>
              <Select
                options={allEnum?.RepresenterType?.map((type, index) => {
                  return { label: type, value: index };
                })}
                value={validation.values.representerType}
                onChange={(e) => {
                  validation.setFieldValue("representerType", e);
                }}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.representerType &&
                validation.errors.representerType && (
                  <span className="text-error text-xs">
                    {validation.errors.representerType}
                  </span>
                )}
            </div>

            {validation.values.representerType + 1
              ? handleShowRepresentList()
              : null}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">شخص فعال است؟</span>
            <Checkbox
              checked={validation.values.isActive}
              name="isActive"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.isActive && validation.errors.isActive && (
              <span className="text-error text-xs">
                {validation.errors.isActive}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">شخص فعال است؟</span>
            <Checkbox
              checked={validation.values.isActive}
              name="isActive"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.isActive && validation.errors.isActive && (
              <span className="text-error text-xs">
                {validation.errors.isActive}
              </span>
            )}
          </div>
        </Form>
      </Modal>
    </>
  );
}
