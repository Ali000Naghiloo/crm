import { Button, Checkbox, Input, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AmountLimits({ values, setField }) {
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const defaultRow = {
    lowestAmount: 0,
    highestAmount: 0,
    allFactorsExceptTheSpecifiedItems: true,
    factorReceiptAndPaymentConditions: 0,
    description: "string",
  };

  const columns = [
    {
      title: "کمترین حد",
      dataIndex: "lowestAmount",
      key: "lowestAmount",
      render: (value, record) => {
        return (
          <div>
            <Input
              type="number"
              value={value}
              onChange={(e) =>
                handleCellChange(`factorAmount.lowestAmount`, e.target.value)
              }
            />
          </div>
        );
      },
    },
    {
      title: "بیشترین حد",
      dataIndex: "highestAmount",
      key: "highestAmount",
      render: (value, record) => {
        return (
          <div>
            <Input
              type="number"
              value={value}
              onChange={(e) =>
                handleCellChange(`factorAmount.highestAmount`, e.target.value)
              }
            />
          </div>
        );
      },
    },
    {
      title: "این شرط استثنا باشد",
      dataIndex: "allFactorsExceptTheSpecifiedItems",
      key: "allFactorsExceptTheSpecifiedItems",
      render: (value, record) => {
        return (
          <div>
            <Checkbox
              checked={value}
              onChange={(e) =>
                handleCellChange(
                  `factorAmount[${
                    record?.index - 1
                  }].allFactorsExceptTheSpecifiedItems`,
                  e.target.checked
                )
              }
            />
          </div>
        );
      },
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
                handleCellChange(`factorAmount.description`, e.target.value)
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

  useEffect(() => {}, []);

  return (
    <div className="w-full overflow-auto">
      <div className="w-full overflow-x-auto flex flex-wrap gap-6">
        {columns.map((col, index) => {
          return (
            <div
              key={col.key}
              className="flex gap-3 items-center justify-center min-w-[300px] md:min-w-[460px]"
            >
              <span className="font-bold w-[50%] text-end">{col.title} : </span>
              {col.render(values[`${col.dataIndex}`])}
            </div>
          );
        })}
      </div>
    </div>
  );
}
