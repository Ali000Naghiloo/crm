import { Button, Input, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useHttp from "../../../hooks/useHttps";
import formatHelper from "../../../helper/formatHelper";
import { BiMinus, BiPlus } from "react-icons/bi";

export default function Calculations({
  validation,
  factorItems,
  factorTotalQuantity,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [calculations, setCalculations] = useState({
    allFactorPrice: 0, // before conditions
    allConditions: null,
    allConditionsValue: 0,
    paymentMethod: 0,
  });
  const [mainFactorPrice, setMainFactorPrice] = useState(0);
  const [mainConditionsValue, setMainConditionsValue] = useState(0);
  const allEnum = useSelector((state) => state.allEnum.allEnum);
  const [calculated, setCalculated] = useState([]);

  const handleCalculations = async () => {
    setLoading(true);
    const conditionFormData = {
      ...validation.values,
      factorAdditionsAndDeductionsMappings: null,
    };

    // set all details
    await httpService
      .post("/Factor/GetFactorAdditionsAndDeductions", conditionFormData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          // calculate price with conditions
          let allConditionsValue = 0;
          handleCalculatePrice(
            res.data?.factorAdditionsAndDeductionsMappingCreateViewModelList
          ),
            setCalculations({
              ...calculations,
              allConditions:
                res.data
                  ?.factorAdditionsAndDeductionsMappingCreateViewModelList,
              allConditionsValue: allConditionsValue,
              allFactorPrice: handleCalculatePrice(
                res.data?.factorAdditionsAndDeductionsMappingCreateViewModelList
              ),
            });
          setMainFactorPrice(validation.values.totalFactorPrice);
          setMainConditionsValue(allConditionsValue);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleCalculatePrice = (conditions) => {
    let newPrice = calculations.allFactorPrice;
    let sortedByPrio = conditions.sort((a, b) => a.priority - b.priority);

    sortedByPrio.map((c) => {
      let value = c?.amount;
      if (c.conditionsType == "درصد") {
        value = (newPrice * c?.amount) / 100;
      }
      if (c?.impactOnFactorAmount === "کاهنده") {
        newPrice -= value;
      }
      if (c?.impactOnFactorAmount === "افزاینده") {
        newPrice += value;
      }
    });

    setMainFactorPrice(newPrice);
    console.log(newPrice);
    return newPrice;
  };

  const handleChangeConditions = (e, index, data) => {
    setCalculations((prev) => {
      let newConditions = [...prev.allConditions];
      newConditions[index].amount = e;
      let newAllConditionsValue = prev.allConditionsValue;
      newConditions.map((c) => {
        if (c.impactOnFactorAmount === "افزاینده") {
          newAllConditionsValue = newAllConditionsValue + c?.amount;
        }
        if (c.impactOnFactorAmount === "کاهنده") {
          newAllConditionsValue = newAllConditionsValue - c?.amount;
        }
      });
      let newAllFactorPrice = handleCalculatePrice(newConditions);

      return {
        ...prev,
        allConditions: newConditions,
        allConditionsValue: newAllConditionsValue,
        allFactorPrice: newAllFactorPrice,
      };
    });
  };

  useEffect(() => {
    if (calculations.allFactorPrice) {
      validation.setFieldValue("totalFactorPrice", calculations.allFactorPrice);
      validation.setFieldValue("totalFactorQuantity", factorTotalQuantity);
      validation.setFieldValue(
        "factorAdditionsAndDeductionsMappings",
        calculations.allConditions
      );
    }
  }, [calculations]);

  useEffect(() => {
    if (factorItems && validation.values.factorType) {
      handleCalculations();
    }
  }, [factorItems]);

  return (
    <>
      <div className="w-full flex flex-col justify-start items-start pt-10">
        {/* conditions */}
        <div className="w-full flex flex-col gap-2 text-lg border-b-[1px] border-b-gray-300 p-3">
          <span className="font-bold">اضافات کسورات : </span>
          <div className="w-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-col items-center justify-end">
              {calculations.allConditions &&
              calculations.allConditions?.length !== 0 ? (
                calculations.allConditions?.map((value, index) => {
                  return (
                    <div
                      className="flex items-end gap-1 text-md p-1"
                      key={index}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <span className="rounded-full border w-[15px] h-[15px] flex justify-center items-center text-center">
                          {value?.impactOnFactorAmount == "افزاینده" ? (
                            <BiPlus />
                          ) : (
                            <BiMinus />
                          )}
                        </span>
                        {value?.factorAdditionsAndDeductions} :
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span>مقدار</span>
                        <Input
                          type="number"
                          className=""
                          size="large"
                          value={
                            (mainFactorPrice *
                              calculations.allConditions[index]["amount"]) /
                            100
                          }
                          onChange={() => {}}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span>درصد</span>
                        <InputNumber
                          type="number"
                          className=""
                          size="large"
                          value={calculations.allConditions[index]["amount"]}
                          onChange={(e) =>
                            handleChangeConditions(e, index, value)
                          }
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <span className="text-sm text-gray-300">
                  اضافات کسورات محاسبه نشده است...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* price count */}
        <div className="w-full flex flex-col gap-2 text-lg border-b-[1px] border-b-gray-300 p-3">
          <span className="font-bold">
            مبلغ کل فاکتور(بعد از اعمال اضافات و کسورات) :
          </span>
          <div className="w-full text-center">
            <span>
              {mainFactorPrice && formatHelper.numberSeperator(mainFactorPrice)}
            </span>
          </div>
        </div>

        {/* description */}
        <div className="flex gap-1 flex-col items-start w-full mx-auto p-3">
          <span className="font-bold text-lg">توضیحات :</span>
          <Input.TextArea
            rows={5}
            value={validation.values.factorDescription}
            name="factorDescription"
            onChange={validation.handleChange}
            className="w-[100%]"
            placeholder="لطفا اینجا وارد کنید..."
            onKeyUp={(e) => console.log(e)}
          />
          {validation.touched.factorDescription &&
            validation.errors.factorDescription && (
              <span className="text-error text-xs">
                {validation.errors.factorDescription}
              </span>
            )}
        </div>
      </div>
    </>
  );
}
