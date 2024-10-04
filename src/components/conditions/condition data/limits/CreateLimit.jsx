import { Button, Select, Skeleton, Tabs } from "antd";
import { useEffect, useState } from "react";
import useHttp from "../../../../hooks/useHttps";
import { useFormik } from "formik";
import * as yup from "yup";
import LimitData from "./LimitData";
import TimeLocationLimit from "./TimeLocationLimit";
import AmountLimit from "./AmountLimit";
import CustomerLimit from "./CustomerLimit";
import ProductLimit from "./ProductLimit";
import { FaTableList } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function CreateLimit({ conditionId, limitId }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [conditionList, setConditionList] = useState(null);

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
        startDate: null,
        endDate: null,
        dayOfWeek: null,
        month: null,
        season: null,
        allTimePeriodsShouldBeTakenExceptDesignatedPeriod: false,
        iranCities: null,
        allAreasExceptWhereSpecified: false,
        description: "",
      },
      factorAmount: {
        lowestAmount: 0,
        highestAmount: 0,
        allFactorsExceptTheSpecifiedItems: false,
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
        allCustomersExcept: false,
        // customerBirthday: null,
        customerSex: null,
        description: "",
      },
      factorProduct: {
        productCategories: [],
        products: [],
        productAmountMin: 0,
        productAmountMax: 0,
        dayAfterManufactureDate: null,
        allProductsExcept: false,
        description: "",
      },
    },
    validationSchema,
    onSubmit: (values) => {
      if (limitId) {
        handleEdit(values);
      } else {
        handleCreate(values);
      }
    },
  });

  const handleCreate = async (values) => {
    setCreateLoading(true);
    const postData = { ...values, additionsAndDeductionsId: conditionId };

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

  const handleEdit = async (values) => {
    setCreateLoading(true);
    const postData = {
      ...values,
      additionsAndDeductionsAllConditionsId: limitId,
    };

    await httpService
      .post(
        "/AdditionsAndDeductionsAllCondition/EditAdditionsAndDeductionAllConditions",
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
    if (tabName === "data") {
      return (
        <LimitData
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
      key: "data",
      label: "اطلاعات شرط",
      children: handleRenderTabContent("data"),
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

  const handleGetLimitData = async () => {
    let data = [];

    await httpService
      .get(
        "/AdditionsAndDeductionsAllCondition/AdditionsAndDeductionAllConditionsDetail",
        { params: { additionsAndDeductionAllConditionsId: limitId } }
      )
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          validation.setValues(
            res.data?.additionsAndDeductionsAllConditionsDetailViewModel
          );
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
    if (limitId) {
      handleGetLimitData();
    }
  }, [limitId]);

  useEffect(() => {
    console.log(validation.values);
  }, [validation.values]);

  return (
    <>
      <div className="w-full">
        {/* limits */}
        <div className="w-full flex justify-center items-center px-8 pt-10">
          {!loading ? (
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
