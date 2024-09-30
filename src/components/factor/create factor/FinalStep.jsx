import { Button, Popconfirm } from "antd";
import React from "react";
import useHttp from "../../../hooks/useHttps";
import { toast } from "react-toastify";

export default function FinalStep({
  validation,
  factorType,
  edit,
  loading,
  setLoading,
  handleRedirect,
}) {
  const { httpService } = useHttp();

  const handleRenderFactorOptions = (type) => {
    if (type === 2) {
      return (
        <Popconfirm
          title="آیا از انتقال این پیش فاکتور به فاکتور اطمینان دارید؟"
          onConfirm={() => handleChangeFactorType(3)}
        >
          <Button type="primary">تبدیل به فاکتور</Button>
        </Popconfirm>
      );
    }
    if (type === 3) {
      return (
        <Popconfirm
          title="آیا از انتقال این فاکتور به برگشت از فروش اطمینان دارید؟"
          onConfirm={() => handleChangeFactorType(4)}
        >
          <Button type="primary" danger>
            تبدیل به برگشت از فروش
          </Button>
        </Popconfirm>
      );
    }
    if (type === 4) {
      return (
        <Popconfirm
          title="آیا از انتقال این برگشت از فروش به فاکتور اطمینان دارید؟"
          onConfirm={() => handleChangeFactorType(3)}
        >
          <Button type="primary" danger>
            تبدیل به فاکتور
          </Button>
        </Popconfirm>
      );
    }
  };

  const handleChangeFactorType = async (type) => {
    setLoading(true);
    const formData = {
      factorId: pageData?.factorId,
      factorType: type,
    };

    if (type === 2) {
      await httpService
        .post("/Factor/ChangeRequestToPreFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code) {
            toast.success("با موفقیت انتقال یافت");
            handleRedirect();
          }
        })
        .catch(() => {});
    }
    if (type === 3) {
      await httpService
        .post("/Factor/ChangePreFactorToFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code) {
            toast.success("با موفقیت انتقال یافت");
            handleRedirect();
          }
        })
        .catch(() => {});
    }
    if (type === 4) {
      await httpService
        .post("/Factor/ChangeFactorToReturnFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code) {
            toast.success("با موفقیت انتقال یافت");
            handleRedirect();
          }
        })
        .catch(() => {});
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center items-center gap-3 pt-5 overflow-x-auto">
        {/* {edit && handleRenderFactorOptions(factorType)} */}
        <Button
          onClick={validation.submitForm}
          type="primary"
          loading={loading}
          disabled={loading}
        >
          ثبت
        </Button>
      </div>
    </>
  );
}
