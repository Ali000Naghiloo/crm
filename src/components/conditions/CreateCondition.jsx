import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../hooks/useHttps";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function CreateCondition({ open, setOpen, getNewList, list }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState(null);

  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    title: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      code: 0,
      title: "",
      amountCanBeChangedByUser: true,
      inSetOfConditionsTheHighestAmountOrPercentageShouldBeConsidered: true,
      additionsAndDeductionsType: 0,
      procedureForApplyingOnFactor: 0,
      displayInTheFactor: 0,
      displayInFactorPrinting: 0,
      description: "",
      factorTypes: [],
      additionsAndDeductionsBannedUsers: [],
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

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
      factorTypes: values?.factorTypes ? values?.factorTypes?.join(", ") : null,
      additionsAndDeductionsBannedUsers:
        values?.additionsAndDeductionsBannedUsers &&
        values?.additionsAndDeductionsBannedUsers
          ? values?.additionsAndDeductionsBannedUsers?.map((id) => {
              return { usersId: id };
            })
          : null,
    };

    await httpService
      .post("/AdditionsAndDeductions/CreateAdditionsAndDeductions", formData)
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
    handleGetEmployeesList();
  }, []);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        onClose={handleClose}
        title="تعریف اضافه کسری جدید"
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
              تعریف اضافه کسری
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نام اضافه کسری</span>
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
            <span>کد اضافه کسری</span>
            <Input
              type="number"
              value={validation.values.code}
              name="code"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.code && validation.errors.code && (
              <span className="text-red-300 text-xs">
                {validation.errors.code}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نوع اضافه کسر</span>
            <Select
              optionFilterProp="label"
              options={allEnum?.AdditionsAndDeductionsType?.map((i, index) => {
                return { label: i, value: index };
              })}
              value={validation.values.additionsAndDeductionsType}
              name="additionsAndDeductionsType"
              onChange={(e) => {
                validation.setFieldValue("additionsAndDeductionsType", e);
              }}
              className="w-full"
              placeholder="لطفا عدد وارد کنید..."
            />
            {validation.touched.additionsAndDeductionsType &&
              validation.errors.additionsAndDeductionsType && (
                <span className="text-red-300 text-xs">
                  {validation.errors.additionsAndDeductionsType}
                </span>
              )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">مقدار توسط کاربر تغییر کند؟</span>
            <Checkbox
              checked={validation.values.amountCanBeChangedByUser}
              name="amountCanBeChangedByUser"
              onChange={(e) => {
                validation.setFieldValue(
                  "amountCanBeChangedByUser",
                  e.target.checked
                );
              }}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">
              بین چند شرط بالاتر از بقیه قرار بگیرد؟
            </span>
            <Checkbox
              checked={
                validation.values
                  .inSetOfConditionsTheHighestAmountOrPercentageShouldBeConsidered
              }
              name="inSetOfConditionsTheHighestAmountOrPercentageShouldBeConsidered"
              onChange={(e) => {
                validation.setFieldValue(
                  "inSetOfConditionsTheHighestAmountOrPercentageShouldBeConsidered",
                  e.target.checked
                );
              }}
              className="w-full"
            />
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>رویه اعمال بر فاکتور</span>
            <Select
              optionFilterProp="label"
              options={allEnum?.ProcedureForApplyingOnFactor?.map(
                (i, index) => {
                  return { label: i, value: index };
                }
              )}
              value={validation.values.procedureForApplyingOnFactor}
              name="procedureForApplyingOnFactor"
              onChange={(e) => {
                validation.setFieldValue("procedureForApplyingOnFactor", e);
              }}
              className="w-full"
              placeholder="لطفا عدد وارد کنید..."
            />
            {validation.touched.procedureForApplyingOnFactor &&
              validation.errors.procedureForApplyingOnFactor && (
                <span className="text-red-300 text-xs">
                  {validation.errors.procedureForApplyingOnFactor}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نمایش در فاکتور</span>
            <Select
              optionFilterProp="label"
              options={allEnum?.DisplayInTheFactor?.map((i, index) => {
                return { label: i, value: index };
              })}
              value={validation.values.displayInTheFactor}
              name="displayInTheFactor"
              onChange={(e) => {
                validation.setFieldValue("displayInTheFactor", e);
              }}
              className="w-full"
              placeholder="لطفا عدد وارد کنید..."
            />
            {validation.touched.displayInTheFactor &&
              validation.errors.displayInTheFactor && (
                <span className="text-red-300 text-xs">
                  {validation.errors.displayInTheFactor}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>نمایش در پرینت فاکتور</span>
            <Select
              optionFilterProp="label"
              options={allEnum?.DisplayInFactorPrinting?.map((i, index) => {
                return { label: i, value: index };
              })}
              value={validation.values.displayInFactorPrinting}
              name="displayInFactorPrinting"
              onChange={(e) => {
                validation.setFieldValue("displayInFactorPrinting", e);
              }}
              className="w-full"
              placeholder="لطفا عدد وارد کنید..."
            />
            {validation.touched.displayInFactorPrinting &&
              validation.errors.displayInFactorPrinting && (
                <span className="text-red-300 text-xs">
                  {validation.errors.displayInFactorPrinting}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>کاربرانی که شامل این اضافه کسری نمیشوند</span>
            <Select
              optionFilterProp="label"
              mode="multiple"
              options={usersList}
              value={validation.values.additionsAndDeductionsBannedUsers}
              name="additionsAndDeductionsBannedUsers"
              onChange={(e) => {
                validation.setFieldValue(
                  "additionsAndDeductionsBannedUsers",
                  e
                );
              }}
              className="w-full"
              placeholder="لطفا عدد وارد کنید..."
            />
            {validation.touched.additionsAndDeductionsBannedUsers &&
              validation.errors.additionsAndDeductionsBannedUsers && (
                <span className="text-red-300 text-xs">
                  {validation.errors.additionsAndDeductionsBannedUsers}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>انواع فاکتور که شامل این اضافه کسری میشوند</span>
            <Select
              optionFilterProp="label"
              mode="multiple"
              options={allEnum?.FactorType?.map((i, index) => {
                return { label: i, value: index };
              })}
              value={validation.values.factorTypes}
              name="factorTypes"
              onChange={(e) => {
                validation.setFieldValue("factorTypes", e);
              }}
              className="w-full"
              placeholder="لطفا عدد وارد کنید..."
            />
            {validation.touched.factorTypes &&
              validation.errors.factorTypes && (
                <span className="text-red-300 text-xs">
                  {validation.errors.factorTypes}
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
