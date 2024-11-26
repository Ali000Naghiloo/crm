import { Button, Input, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useHttp from "../../../hooks/useHttps";
import formatHelper from "../../../helper/formatHelper";

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
          res.data?.factorAdditionsAndDeductionsMappingCreateViewModelList.map(
            (c) => {
              allConditionsValue += c?.amount;
            }
          );

          setCalculations({
            ...calculations,
            allConditions:
              res.data?.factorAdditionsAndDeductionsMappingCreateViewModelList,
            allConditionsValue: allConditionsValue,
            allFactorPrice:
              validation.values.totalFactorPrice + allConditionsValue,
          });
          setMainFactorPrice(validation.values.totalFactorPrice);
          setMainConditionsValue(allConditionsValue);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleChangeConditions = (e, index) =>
    setCalculations((prev) => {
      let newConditions = prev.allConditions;
      newConditions[index]["amount"] = e;
      let newAllConditionsValue = parseFloat(mainConditionsValue) + e;
      let newAllFactorPrice =
        parseFloat(mainFactorPrice) + parseFloat(newAllConditionsValue);

      return {
        ...prev,
        allConditions: newConditions,
        allConditionsValue: newAllConditionsValue,
        allFactorPrice: newAllFactorPrice,
      };
    });

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
            <div className="w-full flex flex-col items-center justify-center">
              {calculations.allConditions &&
              calculations.allConditions?.length !== 0 ? (
                calculations.allConditions?.map((value, index) => {
                  return (
                    <div
                      className="flex items-center gap-1 text-md p-1"
                      key={index}
                    >
                      <p className="font-bold">
                        {value?.factorAdditionsAndDeductions} :
                      </p>
                      <div>
                        <InputNumber
                          type="number"
                          className=""
                          size="large"
                          value={calculations.allConditions[index]["amount"]}
                          onChange={(e) => handleChangeConditions(e, index)}
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
              {formatHelper.numberSeperator(calculations.allFactorPrice)}
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
