import { Button, Select, Skeleton, Tabs } from "antd";
import { useEffect, useState } from "react";
import useHttp from "../../../hooks/useHttps";
import { useFormik } from "formik";
import * as yup from "yup";
import CustomLimits from "./CustomLimits";
import TimeLocationLimit from "./TimeLocationLimit";
import AmountLimit from "./AmountLimit";
import CustomerLimit from "./CustomerLimit";
import ProductLimit from "./ProductLimit";
import { FaTableList } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function CreateLimit() {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [conditionList, setConditionList] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);

  const validationSchema = yup.object().shape({});

  const validation = useFormik({
    initialValues: {
      priority: 0,
      additionsAndDeductionsId: 0,
      condition: {
        conditionTitle: "",
        conditionsType: 0,
        conditionsValue: 0,
        howToApply: 0,
        impactOnFactorAmount: 0,
        calculationOfTheFixedAmountBasedOnTheNumberOfGoods: true,
        maximumAmount: 0,
        headScratchingProcedure: 0,
        howToCalculateWhenTheFactorIsReturned: 0,
        howMuchWillItBeRand: 0,
        notCalculatingOnServiceGoods: true,
        description: "",
      },
      timePeriodAndLocation: {
        timePeriod: null,
        startDate: "",
        endDate: "",
        dayOfWeek: null,
        month: null,
        season: null,
        allTimePeriodsShouldBeTakenExceptDesignatedPeriod: null,
        iranCities: null,
        allAreasExceptWhereSpecified: null,
        description: "",
      },
      factorAmount: {
        lowestAmount: 0,
        highestAmount: 0,
        allFactorsExceptTheSpecifiedItems: true,
        factorReceiptAndPaymentConditions: 0,
        description: "",
      },
      factorCustomer: {
        customers: [],
        customerRoles: [],
        customerPurchaseFrequencyMin: 0,
        customerPurchaseFrequencyMax: 0,
        customerPurchaseAmountFromTheBeginningOfCooperationMin: 0,
        customerPurchaseAmountFromTheBeginningOfCooperationMax: 0,
        allCustomersExcept: null,
        customerBirthday: null,
        customerSex: null,
        description: "",
      },
      factorProduct: {
        productCategories: [],
        products: [],
        productAmountMin: null,
        productAmountMax: null,
        dayAfterManufactureDate: null,
        allProductsExcept: null,
        description: "",
      },
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const handleCreate = async (values) => {
    setCreateLoading(true);
    const postData = { ...values, additionsAndDeductionsId: selectedCondition };

    await httpService
      .post(
        "/AdditionsAndDeductionsAllCondition/CreateAdditionsAndDeductionAllConditions",
        postData
      )
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          toast.success(`شروط شما با موفقیت به اضافه کسری نسبت داده شد`);
        }
      })
      .catch(() => {});

    setCreateLoading(false);
  };

  const handleRenderTabContent = (tabName) => {
    if (tabName === "custom") {
      return (
        <CustomLimits
          values={validation.values.condition}
          setField={(name, value) => validation.setFieldValue(name, value)}
          loading={loading}
        />
      );
    }
    if (tabName === "timeAndLocation") {
      return (
        <TimeLocationLimit
          values={validation.values.timePeriodAndLocation}
          setField={(name, value) => validation.setFieldValue(name, value)}
        />
      );
    }
    if (tabName === "amount") {
      return (
        <AmountLimit
          values={validation.values.factorAmount}
          setField={(name, value) => validation.setFieldValue(name, value)}
        />
      );
    }
    if (tabName === "customer") {
      return (
        <CustomerLimit
          values={validation.values.factorCustomer}
          setField={(name, value) => validation.setFieldValue(name, value)}
        />
      );
    }
    if (tabName === "product") {
      return (
        <ProductLimit
          values={validation.values.factorProduct}
          setField={(name, value) => validation.setFieldValue(name, value)}
        />
      );
    }
  };

  const conditionTabs = [
    {
      key: "custom",
      label: "شرط دلخواه",
      children: handleRenderTabContent("custom"),
    },
    {
      key: "timeAndLocation",
      label: "زمان و مکان",
      children: handleRenderTabContent("timeAndLocation"),
    },
    {
      key: "amount",
      label: "تعداد",
      children: handleRenderTabContent("amount"),
    },
    {
      key: "customer",
      label: "شخص",
      children: handleRenderTabContent("customer"),
    },
    {
      key: "product",
      label: "محصول",
      children: handleRenderTabContent("product"),
    },
  ];

  const handleGetConditionList = async () => {
    let data = [];

    await httpService
      .get("/AdditionsAndDeductions/AdditionsAndDeductions")
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          res.data?.additionsAndDeductionsViewModelList?.map((con) => {
            data.push({
              label: con?.title,
              value: con?.additionsAndDeductionsId,
            });
          });
        }
      });

    setConditionList(data);
  };

  const handleSwitchCondition = async (value) => {
    setLoading(true);

    if (value) {
      await httpService
        .get("/AdditionsAndDeductions/AdditionsAndDeductionDetail", {
          params: { additionsAndDeductionId: value },
        })
        .then((res) => {
          if (res.status === 200 && res.data?.code == 1) {
            res.data?.additionsAndDeductionsDetailViewModel?.allConditions;
          }
        })
        .catch(() => {});
    }

    setLoading(false);
    setSelectedCondition(value);
  };

  useEffect(() => {
    handleGetConditionList();
  }, []);

  useEffect(() => {
    console.log(validation.values);
  }, [validation.values]);

  return (
    <>
      <div className="w-full">
        <div className="w-full text-2xl font-bold p-5 md:p-10">
          <h1>تعیین شرط برای اضافات و کسورات </h1>
        </div>

        <div className="w-full flex justify-center items-center rounded py-3">
          <div className="flex flex-col">
            <span>اضافه کسری مد نظر را انتخاب کنید:</span>
            <Select
              loading={conditionList ? false : true}
              allowClear
              options={conditionList}
              value={selectedCondition}
              onChange={(e) => {
                handleSwitchCondition(e);
              }}
              placeholder="انتخاب کنید..."
            />
          </div>
        </div>

        {/* limits */}
        <div className="w-full flex justify-center items-center px-8 pt-10">
          {!loading ? (
            selectedCondition ? (
              <div className="w-full">
                <Tabs items={conditionTabs} className="w-full" />

                {/* submit */}
                <div className="w-full flex justify-center items-center py-8 mt-10">
                  <Button
                    size="large"
                    type="primary"
                    loading={createLoading}
                    disabled={createLoading}
                    onClick={validation.submitForm}
                  >
                    ثبت شروط
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full text-gray-300 flex justify-center items-center py-20">
                <span>برای تعیین شرط یک اضافه کسری را انتخاب کنید ...</span>
              </div>
            )
          ) : (
            <div className="w-full h-full flex justify-center items-center overflow-hidden">
              <Skeleton.Node
                active
                style={{
                  width: "800px",
                  height: "500px",
                  borderRadius: "20px",
                }}
              >
                <FaTableList size={"8em"} className="text-gray-500" />
              </Skeleton.Node>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
