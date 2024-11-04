import { Button, Checkbox, Input, Select } from "antd";
import { useSelector } from "react-redux";

export default function LimitData({ values, setField }) {
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const defaultRow = {
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
  };

  const columns = [
    {
      title: "عنوان شرط",
      dataIndex: "conditionTitle",
      key: "conditionTitle",
      render: (value, record) => {
        return (
          <div className="">
            <Input
              className="w-[150px]"
              value={value}
              onChange={(e) =>
                handleCellChange(`condition.conditionTitle`, e.target.value)
              }
            />
          </div>
        );
      },
    },
    {
      title: "نوع شرط",
      dataIndex: "conditionsType",
      key: "conditionsType",
      render: (value, record) => {
        return (
          <Select
            className="w-[150px]"
            options={allEnum?.ConditionsType?.map((ty, index) => {
              return { label: ty, value: index };
            })}
            value={value}
            onChange={(e) => handleCellChange(`condition.conditionsType`, e)}
          />
        );
      },
    },
    {
      title: "اولویت شرط",
      dataIndex: "priority",
      key: "priority",
      render: (value, record) => {
        return (
          <Input
            type="number"
            className="w-[150px]"
            value={value}
            onChange={(e) =>
              handleCellChange(`priority`, parseFloat(e.target.value))
            }
          />
        );
      },
    },
    {
      title: "مقدار شرط",
      dataIndex: "conditionsValue",
      key: "conditionsValue",
      render: (value, record) => {
        return (
          <div>
            <Input
              className="w-[150px]"
              value={value}
              onChange={(e) =>
                handleCellChange(`condition.conditionsValue`, e.target.value)
              }
            />
          </div>
        );
      },
    },
    {
      title: "نحوه پیاده سازی",
      dataIndex: "howToApply",
      key: "howToApply",
      render: (value, record) => {
        return (
          <div>
            <Select
              className="w-[150px]"
              options={allEnum?.HowToApply?.map((ty, index) => {
                return { label: ty, value: index };
              })}
              value={value}
              onChange={(e) => handleCellChange(`condition.howToApply`, e)}
            />
          </div>
        );
      },
    },
    {
      title: "تاثیر بر مقدار فاکتور",
      dataIndex: "impactOnFactorAmount",
      key: "impactOnFactorAmount",
      render: (value, record) => {
        return (
          <div>
            <Select
              className="w-[150px]"
              options={allEnum?.ImpactOnFactorAmount?.map((ty, index) => {
                return { label: ty, value: index };
              })}
              value={value}
              onChange={(e) =>
                handleCellChange(`condition.impactOnFactorAmount`, e)
              }
            />
          </div>
        );
      },
    },
    {
      title: "مقدار حداکثر",
      dataIndex: "maximumAmount",
      key: "maximumAmount",
      render: (value, record) => (
        <div>
          <Input
            className="w-[150px]"
            type="number"
            value={value}
            onChange={(e) => handleCellChange(`condition.maximumAmount`, e)}
          />
        </div>
      ),
    },
    {
      title: "نحوه سرشکن",
      dataIndex: "headScratchingProcedure",
      key: "headScratchingProcedure",
      render: (value, record) => (
        <div>
          <Select
            className="w-[150px]"
            options={allEnum?.HeadScratchingProcedure?.map((ty, index) => {
              return { label: ty, value: index };
            })}
            value={value}
            onChange={(e) =>
              handleCellChange(`condition.headScratchingProcedure`, e)
            }
          />
        </div>
      ),
    },
    {
      title: "نحوه محاسبه برگشت از فروش",
      dataIndex: "howToCalculateWhenTheFactorIsReturned",
      key: "howToCalculateWhenTheFactorIsReturned",
      render: (value, record) => (
        <div>
          <Select
            className="w-[150px]"
            options={allEnum?.HowToCalculateWhenTheFactorIsReturned?.map(
              (ty, index) => {
                return { label: ty, value: index };
              }
            )}
            value={value}
            onChange={(e) =>
              handleCellChange(
                `condition.howToCalculateWhenTheFactorIsReturned`,
                e
              )
            }
          />
        </div>
      ),
    },
    {
      title: "میزان رند شدن",
      dataIndex: "howMuchWillItBeRand",
      key: "howMuchWillItBeRand",
      render: (value, record) => (
        <div>
          <Select
            className="w-[150px]"
            options={allEnum?.HowMuchWillItBeRandNumber?.map((ty, index) => {
              return { label: ty, value: index };
            })}
            value={value}
            onChange={(e) =>
              handleCellChange(`condition.howMuchWillItBeRand`, e)
            }
          />
        </div>
      ),
    },
    {
      title: "محاسبه نشدن کالا های خدماتی",
      dataIndex: "notCalculatingOnServiceGoods",
      key: "notCalculatingOnServiceGoods",
      render: (value, record) => (
        <div>
          <Checkbox
            checked={value}
            onChange={(e) => {
              handleCellChange(
                `condition.notCalculatingOnServiceGoods`,
                e.target.checked
              );
            }}
          />
        </div>
      ),
    },
    {
      title: "مبلغ ثابت بر اساس تعداد کالا؟",
      dataIndex: "calculationOfTheFixedAmountBasedOnTheNumberOfGoods",
      key: "calculationOfTheFixedAmountBasedOnTheNumberOfGoods",
      render: (value, record) => (
        <div>
          <Checkbox
            checked={value}
            onChange={(e) => {
              handleCellChange(
                `condition.calculationOfTheFixedAmountBasedOnTheNumberOfGoods`,
                e.target.checked
              );
            }}
          />
        </div>
      ),
    },
    {
      title: "توضیحات",
      dataIndex: "description",
      key: "description",
      render: (value, record) => {
        return (
          <div>
            <Input
              value={value}
              onChange={(e) =>
                handleCellChange(`condition.description`, e.target.value)
              }
            />
          </div>
        );
      },
    },
  ];

  const handleCellChange = (field, value) => {
    setField(`${field}`, value);
  };

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto flex flex-wrap gap-3">
        {columns.map((col, index) => {
          return (
            <div
              key={index}
              className="flex gap-3 items-center min-w-[300px] md:min-w-[460px] mx-auto"
            >
              <span className="font-bold w-[50%]">{col.title} : </span>
              {col.render(values[`${col.dataIndex}`])}
            </div>
          );
        })}
      </div>
    </div>
  );
}
