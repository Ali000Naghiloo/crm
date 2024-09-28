import { Button, Checkbox, Form, Input, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import MyDatePicker from "../../../common/MyDatePicker";
import moment from "jalali-moment";
import { convertDateToISO, convertISOToDate } from "../../../hooks/functions";
import { toast } from "react-toastify";

export default function DataTab({ data, getNewList, handleClose }) {
  const [loading, setLoading] = useState(false);
  const allEnum = useSelector((state) => state.allEnum.allEnum);
  const { httpService } = useHttp();

  const validationSchema = yup.object().shape({
    customerType: yup.string().required("این فیلد را پر کنید"),
    customerId: yup.string().required("این فیلد را پر کنید"),
    // customerCod: yup.string().required("این فیلد را پر کنید"),
    // startDateTime: yup.string().required("این فیلد را پر کنید"),
    // endDateTime: yup.string().required("این فیلد را پر کنید"),
    // nickName: yup.string().required("این فیلد را پر کنید"),
    // description: yup.string().required("این فیلد را پر کنید"),
    // representerName: yup.string().required("این فیلد را پر کنید"),
    // nationalID: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      // common fields
      customerType: "",
      customerId: "",
      customerCod: "",
      startDateTime: null,
      endDateTime: null,
      nickName: "",
      description: "",
      isActive: null,
      representerType: 0,
      representerId: 0,
      representerName: "",
      nationalID: "",
      // person fields
      firstName: "",
      lastName: "",
      customerSex: null,
      birthdayDateTime: "",
      maritalStatus: null,
      numberOfChildren: 0,
      nameOfPartner: "",
      // company fields
      customerName: "",
      companyType: 0,
      economicCode: "",
      registrationDateTime: null,
      registrationNumber: "",
    },

    validationSchema,

    onSubmit: (values) => {
      handleEditCustomerData(values);
    },
  });

  const handleEditCustomerData = async (values) => {
    setLoading(true);
    // common fields
    const formData = {
      customerType: values?.customerType,
      customerId: values?.customerId,
      customerName: values.customerType === 1 ? values?.customerName : "string",
      customerCod: values?.customerCod,
      startDateTime: values?.startDateTime,
      endDateTime: values?.endDateTime,
      nickName: values?.nickName,
      description: values?.description,
      isActive: values?.isActive,
      nationalID: `${values?.nationalID}`,
      // person fields
      firstName: values?.firstName ? values?.firstName : "",
      lastName: values?.lastName ? values?.lastName : "",
      customerSex: values?.customerSex,
      birthdayDateTime: values?.birthdayDateTime,
      maritalStatus: values?.maritalStatus + 1 ? values.maritalStatus : null,
      numberOfChildren: values?.numberOfChildren,
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
      .post("/Customer/EditCustomer", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("اطلاعات شخص ثبت شد");
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleRenderFieldByCustomerType = (type) => {
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
              <span className="text-red-300 text-xs">
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
              <span className="text-red-300 text-xs">
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
                <span className="text-red-300 text-xs">
                  {validation.errors.birthdayDateTime}
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
            />
            {validation.touched.customerSex &&
              validation.errors.customerSex && (
                <span className="text-red-300 text-xs">
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
                <span className="text-red-300 text-xs">
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
                    <span className="text-red-300 text-xs">
                      {validation.errors.nameOfPartner}
                    </span>
                  )}
              </div>

              <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
                <span>تعداد فرزندان :</span>
                <Input
                  type="number"
                  value={validation.values.numberOfChildren}
                  name="numberOfChildren"
                  onChange={validation.handleChange}
                  className="w-full"
                  placeholder="لطفا اینجا وارد کنید..."
                />
                {validation.touched.numberOfChildren &&
                  validation.errors.numberOfChildren && (
                    <span className="text-red-300 text-xs">
                      {validation.errors.numberOfChildren}
                    </span>
                  )}
              </div>
            </>
          ) : null}
        </>
      );
    }
    if (type === 1) {
      return (
        <>
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نام شرکت :</span>
            <Input
              value={validation.values.customerName}
              name="customerName"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.customerName &&
              validation.errors.customerName && (
                <span className="text-red-300 text-xs">
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
                <span className="text-red-300 text-xs">
                  {validation.errors.companyType}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>کد اقتصادی :</span>
            <Input className="w-full" placeholder="لطفا اینجا وارد کنید..." />
            {validation.touched.economicCode &&
              validation.errors.economicCode && (
                <span className="text-red-300 text-xs">
                  {validation.errors.economicCode}
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
              status=""
            />
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>شماره ثبت شرکت :</span>
            <Input className="w-full" placeholder="لطفا اینجا وارد کنید..." />
            {validation.touched.companyType &&
              validation.errors.companyType && (
                <span className="text-red-300 text-xs">
                  {validation.errors.companyType}
                </span>
              )}
          </div>
        </>
      );
    }
  };

  useEffect(() => {
    if (data) {
      validation.setFieldValue("customerType", data?.customerType);
      validation.setFieldValue("customerId", data?.customerId);
      validation.setFieldValue("customerName", data?.customerName);
      validation.setFieldValue("customerCod", data?.customerCod);
      validation.setFieldValue("startDateTime", data?.startDateTime);
      validation.setFieldValue("endDateTime", data?.endDateTime);
      validation.setFieldValue("nickName", data?.nickName);
      validation.setFieldValue("nationalID", data?.nationalID);
      validation.setFieldValue("description", data?.description);
      validation.setFieldValue("isActive", data?.isActive);
      // person fields
      validation.setFieldValue("firstName", data?.firstName);
      validation.setFieldValue("lastName", data?.lastName);
      validation.setFieldValue("customerSex", data?.customerSex);
      validation.setFieldValue("birthdayDateTime", data?.birthdayDateTime);
      validation.setFieldValue("maritalStatus", data?.maritalStatus);
      validation.setFieldValue("numberOfChildren", data?.numberOfChildren);
      validation.setFieldValue("nameOfPartner", data?.nameOfPartner);
      // company fields
      validation.setFieldValue("customerName", data?.customerName);
      validation.setFieldValue("companyType", data?.companyType);
      validation.setFieldValue("economicCode", data?.economicCode);
    }
  }, [data]);

  useEffect(() => {
    // console.log(moment(validation.values.startDateTime).locale("fa"));
  }, [validation.values]);

  return (
    <>
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
              <span className="text-red-300 text-xs">
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
            <span className="text-red-300 text-xs">
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
          {validation.touched.description && validation.errors.description && (
            <span className="text-red-300 text-xs">
              {validation.errors.description}
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
            <span className="text-red-300 text-xs">
              {validation.errors.isActive}
            </span>
          )}
        </div>

        {/* submit */}
        <div className="w-full py-10 flex justify-center">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            ثبت اطلاعات
          </Button>
        </div>
      </Form>
    </>
  );
}
