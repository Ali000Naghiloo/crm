import { useEffect, useState } from "react";
import { Button, Dropdown, Form, Steps } from "antd";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import FinalStep from "./FinalStep";
import { FaAngleDown, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import SelectItems from "./SelectItems";
import Calculations from "./Calculations";
import { SiCodefactor } from "react-icons/si";
import { BiCalculator } from "react-icons/bi";
import { BsCheckCircleFill } from "react-icons/bs";

export default function CreateFactor() {
  const { httpService } = useHttp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [factorTitle, setFactorTitle] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  // steps
  const [nextStepDisabled, setNextStepDisabled] = useState(false);
  const [pervStepDisabled, setPrevStepDisabled] = useState(false);

  // page data
  const [pageData, setPageData] = useState(null);

  const { state } = useLocation();

  const allEnum = useSelector((state) => state.allEnum.allEnum);
  const userData = useSelector((state) => state.userData.userData);

  const steps = [
    {
      title: "انتخاب کالا و خدمات",
      description: "",
      icon: <SiCodefactor />,
    },
    {
      title: "محاسبات فاکتور",
      description: "محاسبات اضافات کسورات, مبلغ و نحوه پرداخت  فاکتور",
      icon: <BiCalculator />,
    },
    {
      title: "ثبت نهایی",
      description: "فاکتور شما به حسابداری ارسال میگردد",
      icon: <BsCheckCircleFill />,
    },
  ];

  const validationSchema = yup.object().shape({
    customerId: yup.number().required("این فیلد را پر کنید"),
    factorDate: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      factorNumber: 0,
      factorDate: null,
      customerId: null,
      totalFactorQuantity: 0,
      totalFactorDiscount: 0,
      totalFactorPrice: 0,
      factorDescription: "",
      factorResponsibleId: null,
      factorItemCreateViewModels: [
        {
          itemRow: 1,
          productId: null,
          unitId: null,
          quantity: 0,
          productUnitPrice: 0,
          discount: 0,
          inventory: 0,
          description: "",
          totalPrice: 0,
        },
      ],
    },

    validationSchema,

    onSubmit: (values) => {
      handleCreateFactor(values);
    },
  });

  const handleGetFactorData = async (id) => {
    setLoading(true);

    await httpService
      .get("/Factor/GetFactorDetail", { params: { factorId: id } })
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          validation.setFieldValue(
            "factorDate",
            res.data?.factorDetailViewModel?.factorDate
          );
          validation.setFieldValue(
            "customerId",
            res.data?.factorDetailViewModel?.customerId
          );
          validation.setFieldValue(
            "factorNumber",
            res.data?.factorDetailViewModel?.factorNumber
          );
          validation.setFieldValue(
            "factorItemCreateViewModels",
            res.data?.factorDetailViewModel?.factorItems
          );
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleChangeFactorStatus = async (type) => {
    const formData = {
      factorId: pageData?.factorId,
      factorStatus: type,
    };

    await httpService
      .get("/Factor/ChangeFactorStatus", { params: formData })
      .then((res) => {
        if ((res.status === 200) & (res.data?.code == 1)) {
          toast.success("وضعیت فاکتور با موفقیت تغییر کرد");
        }
      })
      .catch(() => {});
  };

  const handleRedirect = () => {
    if (!loading) {
      validation.resetForm();
      navigate(-1);
    }
  };

  const handleCreateFactor = async (values) => {
    setLoading(true);
    const formData = {
      factorNumber: values?.factorNumber,
      factorDate: values?.factorDate,
      customerId: values?.customerId,
      totalFactorQuantity: values?.totalFactorQuantity,
      totalFactorDiscount: values?.totalFactorDiscount,
      totalFactorPrice: values?.totalFactorPrice,
      factorDescription: values?.factorDescription,
      factorResponsibleId: values?.factorResponsibleId,
      factorItemCreateViewModels:
        values?.factorItemCreateViewModels &&
        values?.factorItemCreateViewModels?.length !== 0
          ? values?.factorItemCreateViewModels?.map((item) => {
              return {
                ...item,
              };
            })
          : null,
    };

    if (pageData?.type === 2) {
      await httpService
        .post("/Factor/CreatePreFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code === 1) {
            toast.success("با موفقیت ساخته شد");
            handleRedirect();
          }
        })
        .catch(() => {});
    }
    if (pageData?.type === 3) {
      await httpService
        .post("/Factor/CreateFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code === 1) {
            toast.success("با موفقیت ساخته شد");
            handleRedirect();
          }
        })
        .catch(() => {});
    }
    if (pageData?.type === 4) {
      await httpService
        .post("/Factor/CreateReturnFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code === 1) {
            toast.success("با موفقیت ساخته شد");
            handleRedirect();
          }
        })
        .catch(() => {});
    }

    setLoading(false);
  };

  const handleChangeStep = (next) => {
    if (next) {
      if (
        validation.values.factorItemCreateViewModels &&
        Object.keys(validation.errors).length === 0
      ) {
        setCurrentStep(currentStep + 1);
        setPrevStepDisabled(false);
      } else {
        console.log(validation.errors);
        toast.warn("لطفا برای فاکتور خود محصول انتخاب کنید");
      }
    } else {
      setCurrentStep(currentStep - 1);
      setNextStepDisabled(false);
    }
  };

  const handleModalTitle = () => {
    // if (pageData?.type == 0) {
    //   setFactorTitle("ثبت درخواست اولیه جدید");
    // }
    if (pageData?.type == 2) {
      setFactorTitle("ثبت پیش فاکتور جدید");
    }
    if (pageData?.type == 3) {
      setFactorTitle("ثبت فاکتور جدید");
    }
    if (pageData?.type == 4) {
      setFactorTitle("ثبت فاکتور برگشت از فروش جدید");
    }
  };

  // count factor price
  useEffect(() => {
    console.log(validation.values.factorItemCreateViewModels);
  }, [validation.values.factorItemCreateViewModels]);

  // set factor-responsible and customer
  useEffect(() => {
    if (userData) {
      validation.setFieldValue("factorResponsibleId", userData?.id);
    }
    if (pageData?.customerId) {
      validation.setFieldValue("customerId", pageData.customerId);
    }
  }, [userData, pageData?.customerId]);

  // set modal title by having data
  useEffect(() => {
    handleModalTitle();
  }, [pageData]);

  useEffect(() => {
    if (pageData?.factorId) {
      setFactorTitle(`ویرایش فاکتور : ${pageData?.data?.factorNumber}`);
      handleGetFactorData(pageData?.factorId);
    }
  }, [pageData]);

  // set page data
  useEffect(() => {
    if (state) {
      setPageData(state);
    }
  }, [state]);

  useEffect(() => {
    if (currentStep < 1) {
      setPrevStepDisabled(true);
    }
    if (currentStep == steps.length - 1) {
      setNextStepDisabled(true);
    }
  }, [currentStep]);

  return (
    <>
      <div className="w-full flex p-1 md:p-3">
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-col gap-10"
        >
          <div className="w-full flex justify-between items-center font-bold px-4 my-10 h-fit">
            <h1 className="text-lg md:text-4xl">{factorTitle}</h1>

            <div className="flex items-center">
              {pageData?.data && (
                <Dropdown
                  menu={{
                    items: allEnum?.FactorStatus?.map((v, index) => {
                      return {
                        key: index,
                        label: (
                          <div
                            className="w-full h-full"
                            onClick={() => handleChangeFactorStatus(index)}
                          >
                            {v}
                          </div>
                        ),
                      };
                    }),
                  }}
                >
                  <Button
                    size="small"
                    danger
                    type="primary"
                    className="cursor-pointer"
                  >
                    تغییر وضعیت فاکتور <FaAngleDown />
                  </Button>
                </Dropdown>
              )}
              <Button
                size="large"
                type="link"
                className="mr-2"
                onClick={handleRedirect}
              >
                بازگشت
                <FaAngleLeft />
              </Button>
            </div>
          </div>

          <Steps className="w-full" current={currentStep} items={steps} />

          {/* steps */}
          <div className="w-full border-2 py-5 rounded-md">
            {currentStep == 0 && (
              <SelectItems
                validation={validation}
                factorType={pageData?.type}
                customerId={pageData?.customerId}
                setStep={setCurrentStep}
              />
            )}

            {currentStep == 1 && (
              <Calculations
                validation={validation}
                factorItems={validation.values.factorItemCreateViewModels}
                setStep={setCurrentStep}
              />
            )}

            {currentStep == 2 && (
              <FinalStep
                validation={validation}
                factorType={pageData?.type}
                loading={loading}
                edit={pageData?.data ? true : false}
                handleRedirect={handleRedirect}
                setStep={setCurrentStep}
              />
            )}
          </div>

          {/* change step */}
          <div className="w-full flex justify-center gap-1 items-center py-10">
            <Button
              type="primary"
              onClick={() => {
                handleChangeStep(false);
              }}
              disabled={pervStepDisabled}
            >
              <FaAngleRight /> مرحله قبلی
            </Button>
            <Button
              type="primary"
              onClick={() => {
                handleChangeStep(true);
              }}
              disabled={nextStepDisabled}
            >
              مرحله بعدی <FaAngleLeft />
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
