import { Button, Checkbox, Form, Input, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { toast } from "react-toastify";

export default function DataTab({ data, getNewList, handleClose }) {
  const [loading, setLoading] = useState(false);
  const allEnum = useSelector((state) => state.allEnum.allEnum);
  const { httpService } = useHttp();

  const validationSchema = yup.object().shape({
    pricingMethodGroupTitle: yup.string().required("این فیلد را پر کنید"),
    pricingMethodGroupCode: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      pricingMethodGroupId: null,
      pricingMethodGroupCode: null,
      pricingMethodGroupTitle: "",
      description: "",
    },

    validationSchema,

    onSubmit: (values) => {
      handleEditGroupData(values);
    },
  });

  const handleEditGroupData = async (values) => {
    setLoading(true);
    const formData = {
      pricingMethodGroupId: values?.pricingMethodGroupId,
      pricingMethodGroupCode: values?.pricingMethodGroupCode,
      pricingMethodGroupTitle: values?.pricingMethodGroupTitle,
      description: values?.description,
    };

    await httpService
      .post("/PricingMethodGroup/EditPricingMethodGroup", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("اطلاعات گروه ثبت شد");
          handleClose();
        }
      })
      .catch(() => {});

    getNewList();
    setLoading(false);
  };

  useEffect(() => {
    if (data) {
      validation.setFieldValue(
        "pricingMethodGroupId",
        data?.pricingMethodGroupId
      );
      validation.setFieldValue(
        "pricingMethodGroupTitle",
        data?.pricingMethodGroupTitle
      );
      validation.setFieldValue(
        "pricingMethodGroupCode",
        data?.pricingMethodGroupCode
      );
      validation.setFieldValue("description", data?.description);
    }
  }, [data]);

  return (
    <>
      <Form
        onFinish={validation.handleSubmit}
        className="w-full flex flex-wrap gap-4 max-w-[600px]"
      >
        <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
          <span>عنوان گروه :</span>
          <Input
            value={validation.values.pricingMethodGroupTitle}
            name="pricingMethodGroupTitle"
            onChange={validation.handleChange}
            className="w-full"
            placeholder="لطفا اینجا وارد کنید..."
          />
          {validation.touched.pricingMethodGroupTitle &&
            validation.errors.pricingMethodGroupTitle && (
              <span className="text-error text-xs">
                {validation.errors.pricingMethodGroupTitle}
              </span>
            )}
        </div>

        <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
          <span>کد گروه قیمت گذاری :</span>
          <Input
            value={validation.values.pricingMethodGroupCode}
            name="pricingMethodGroupCode"
            onChange={validation.handleChange}
            className="w-full"
            placeholder="لطفا عدد وارد کنید..."
          />
          {validation.touched.pricingMethodGroupCode &&
            validation.errors.pricingMethodGroupCode && (
              <span className="text-error text-xs">
                {validation.errors.pricingMethodGroupCode}
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
          {validation.touched.description && validation.errors.description && (
            <span className="text-error text-xs">
              {validation.errors.description}
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
