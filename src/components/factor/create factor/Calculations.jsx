import { Button, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useHttp from "../../../hooks/useHttps";
import formatHelper from "../../../helper/formatHelper";

export default function Calculations({ validation, factorItems }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState();
  const [calculations, setCalculations] = useState({
    allFactorPrice: 0,
    allConditions: null,
    paymentMethod: 0,
  });
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const handleCalculations = async () => {
    setLoading(true);
    const conditionFormData = validation.values;

    // set all details
    await httpService
      .post("/Factor/GetFactorAdditionsAndDeductions", conditionFormData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          setCalculations({
            ...calculations,
            allConditions:
              res.data?.factorAdditionsAndDeductionsMappingCreateViewModelList,
            allFactorPrice: validation.values.totalFactorPrice,
          });

          validation.setFieldValue(
            "factorAdditionsAndDeductionsMappings",
            res.data?.factorAdditionsAndDeductionsMappingCreateViewModelList
          );
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    if (factorItems) {
      handleCalculations();
      console.log(validation.values);
    }
  }, [factorItems]);

  return (
    <>
      <div className="w-full flex flex-col justify-start items-start pt-10">
        {/* price count */}
        <div className="w-full flex flex-col gap-2 text-lg border-b-[1px] border-b-gray-300 p-3">
          <span className="font-bold">مبلغ کل فاکتور : </span>{" "}
          <div className="w-full text-center">
            <span>
              {calculations.allFactorPrice
                ? formatHelper.numberSeperator(calculations.allFactorPrice)
                : 0}
            </span>
          </div>
        </div>

        {/* conditions */}
        <div className="w-full flex flex-col gap-2 text-lg border-b-[1px] border-b-gray-300 p-3">
          <span className="font-bold">اضافات کسورات : </span>
          <div className="w-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-col items-center justify-center">
              {calculations.allConditions &&
              calculations.allConditions?.length !== 0 ? (
                calculations.allConditions?.map((value, index) => (
                  <div className="flex gap-1 text-md p-1" key={index}>
                    <p className="font-bold">
                      {value?.factorAdditionsAndDeductions} :{" "}
                    </p>
                    <span>
                      {value?.amount
                        ? formatHelper.numberSeperator(value?.amount)
                        : 0}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-300">
                  اضافات کسورات محاسبه نشده است...
                </span>
              )}
            </div>
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
              <span className="text-red-300 text-xs">
                {validation.errors.factorDescription}
              </span>
            )}
        </div>
      </div>
    </>
  );
}
