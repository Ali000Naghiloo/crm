import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useHttp from "../../../../../../hooks/useHttps";
import { toast } from "react-toastify";

export default function DataTab({
  open,
  setOpen,
  getNewList,
  data,
  pricingMethodId,
  pricingMethodGroupId,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState(null);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    pricingMethodTitle: yup.string().required("لطفا این فیلد را پر کنید"),
    priceType: yup.string().required("لطفا این فیلد را پر کنید"),
    productPriceId: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      pricingMethodId: null,
      pricingMethodGroupId: null,
      pricingMethodTitle: "",
      priceType: 0,
      priority: 0,
      priceValue: 0,
      isActive: true,
      randPrice: false,
      howMuchWillItBeRand: 0,
      productPriceId: null,
      factorTypes: null,
      description: "",
    },

    validationSchema,

    onSubmit: (values) => {
      handleEdit(values);
    },
  });

  const handleClose = () => {
    if (!loading) {
      validation.resetForm();
      setOpen(false);
    }
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      pricingMethodId: pricingMethodId,
      pricingMethodGroupId: pricingMethodGroupId,
      pricingMethodTitle: values?.pricingMethodTitle,
      priceType: values?.priceType,
      priority: values?.priority,
      priceValue: values?.priceValue,
      isActive: values?.isActive,
      randPrice: values?.randPrice,
      howMuchWillItBeRand: values?.howMuchWillItBeRand,
      description: values?.description,
      productPriceId: values?.productPriceId,
      factorTypes:
        values?.factorTypes && values?.factorTypes?.length !== 0
          ? values?.factorTypes?.join(", ")
          : null,
    };

    await httpService
      .post("/PricingMethod/EditPricingMethod", formData)
      .then((res) => {
        if (res.status === 200) {
          handleClose();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleGetPriceList = async () => {
    let datas = [];

    await httpService
      .post("/Price/Prices")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.priceViewModelList?.map((pr) => {
            datas.push({ value: pr?.priceId, label: pr?.priceName });
          });
        }
      })
      .catch(() => {});

    setPrices(datas);
  };

  useEffect(() => {
    handleGetPriceList();
  }, []);

  useEffect(() => {
    if (data) {
      validation.setFieldValue("pricingMethodId", pricingMethodId);
      validation.setFieldValue("pricingMethodGroupId", pricingMethodGroupId);
      validation.setFieldValue("pricingMethodTitle", data?.pricingMethodTitle);
      validation.setFieldValue("priceType", data?.priceType);
      validation.setFieldValue("priority", data?.priority);
      validation.setFieldValue("priceValue", data?.priceValue);
      validation.setFieldValue("isActive", data?.isActive);
      validation.setFieldValue("randPrice", data?.randPrice);
      validation.setFieldValue(
        "howMuchWillItBeRand",
        data?.howMuchWillItBeRand
      );
      validation.setFieldValue("productPriceId", data?.productPriceId);
      validation.setFieldValue("description", data?.description);
      validation.setFieldValue(
        "factorTypes",
        data?.factorTypes && data?.factorTypes?.length !== 0
          ? data?.factorTypes?.split(",")?.map((v) => {
              return parseInt(v);
            })
          : null
      );
    }
  }, [data]);

  return (
    <>
      <div>
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>عنوان :</span>
            <Input
              value={validation.values.pricingMethodTitle}
              name="pricingMethodTitle"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.pricingMethodTitle &&
              validation.errors.pricingMethodTitle && (
                <span className="text-error text-xs">
                  {validation.errors.pricingMethodTitle}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نوع قیمت گذاری :</span>
            <Select
              options={allEnum?.PriceType?.map((type, index) => {
                return { label: type, value: index };
              })}
              value={validation.values.priceType}
              onChange={(e) => {
                validation.setFieldValue("priceType", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.priceType && validation.errors.priceType && (
              <span className="text-error text-xs">
                {validation.errors.priceType}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>قیمت :</span>
            <Input
              type="number"
              min={0}
              value={validation.values.priceValue}
              name="priceValue"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.priceValue && validation.errors.priceValue && (
              <span className="text-error text-xs">
                {validation.errors.priceValue}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>اولویت :</span>
            <Input
              type="number"
              value={validation.values.priority}
              name="priority"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.priority && validation.errors.priority && (
              <span className="text-error text-xs">
                {validation.errors.priority}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>قیمت کالا و خدمات ها :</span>
            <Select
              options={prices}
              loading={prices ? false : true}
              value={validation.values.productPriceId}
              onChange={(e) => {
                validation.setFieldValue("productPriceId", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.productPriceId &&
              validation.errors.productPriceId && (
                <span className="text-error text-xs">
                  {validation.errors.productPriceId}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>انواع فاکتور :</span>
            <Select
              maxTagCount={3}
              mode="multiple"
              options={allEnum?.FactorType?.map((ty, index) => {
                return { label: ty, value: index };
              })}
              value={validation.values.factorTypes}
              onChange={(e) => {
                validation.setFieldValue("factorTypes", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.factorTypes &&
              validation.errors.factorTypes && (
                <span className="text-error text-xs">
                  {validation.errors.factorTypes}
                </span>
              )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">فعال است؟</span>
            <Checkbox
              checked={validation.values.isActive}
              name="isActive"
              onChange={(e) => {
                validation.setFieldValue("isActive", e.target.checked);
              }}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">قیمت رند شود؟</span>
            <Checkbox
              checked={validation.values.randPrice}
              name="randPrice"
              onChange={(e) => {
                validation.setFieldValue("randPrice", e.target.checked);
              }}
              className="w-full"
            />
          </div>

          {validation.values.randPrice && (
            <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
              <span>میزان رند کردن قیمت :</span>
              <Input
                min={0}
                type="number"
                value={validation.values.howMuchWillItBeRand}
                name="howMuchWillItBeRand"
                onChange={validation.handleChange}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.howMuchWillItBeRand &&
                validation.errors.howMuchWillItBeRand && (
                  <span className="text-error text-xs">
                    {validation.errors.howMuchWillItBeRand}
                  </span>
                )}
            </div>
          )}

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>توضیحات اضافه :</span>
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
      </div>
    </>
  );
}
