import { Button, Checkbox, Input, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useSelector } from "react-redux";
import MyDatePicker from "../../../common/MyDatePicker";
import formatHelper from "../../../helper/formatHelper";

const weekDays = [0, 1, 2, 3, 4, 5, 6];

export default function TimeLocationLimits({ values, setField }) {
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const defaultRow = {
    timePeriod: 0,
    startDate: "2024-09-23T09:06:05.197Z",
    endDate: "2024-09-23T09:06:05.197Z",
    dayOfWeek: 0,
    month: 0,
    season: 0,
    allTimePeriodsShouldBeTakenExceptDesignatedPeriod: true,
    iranCities: 0,
    allAreasExceptWhereSpecified: true,
    description: "",
  };

  const columns = [
    {
      title: "تاریخ شروع",
      dataIndex: "startDate",
      key: "startDate",
      render: (value, record) => {
        return (
          <div>
            <MyDatePicker
              value={value}
              setValue={(e) =>
                handleCellChange(`timePeriodsAndLocation.startDate`, e)
              }
            />
          </div>
        );
      },
    },
    {
      title: "تاریخ پایان",
      dataIndex: "endDate",
      key: "endDate",
      render: (value, record) => {
        return (
          <div>
            <MyDatePicker
              value={value}
              setValue={(e) =>
                handleCellChange(`timePeriodsAndLocation.endDate`, e)
              }
            />
          </div>
        );
      },
    },
    {
      title: "روز هفته",
      dataIndex: "dayOfWeek",
      key: "dayOfWeek",
      render: (value, record) => {
        return (
          <div>
            <Select
              options={weekDays.map((day) => {
                return { label: formatHelper.daysName(day), value: day };
              })}
              value={value}
              onChange={(e) =>
                handleCellChange(`timePeriodsAndLocation.dayOfWeek`, e)
              }
            />
          </div>
        );
      },
    },
    {
      title: "ماه",
      dataIndex: "month",
      key: "month",
      render: (value, record) => {
        return (
          <div>
            <Select
              options={allEnum?.HowToApply?.map((ty, index) => {
                return { label: ty, value: index };
              })}
              value={value}
              onChange={(e) =>
                handleCellChange(`timePeriodsAndLocation.month`, e)
              }
            />
          </div>
        );
      },
    },
    {
      title: "فصل",
      dataIndex: "season",
      key: "season",
      render: (value, record) => {
        return (
          <div>
            <Select
              options={allEnum?.ImpactOnFactorAmount?.map((ty, index) => {
                return { label: ty, value: index };
              })}
              value={value}
              onChange={(e) =>
                handleCellChange(`timePeriodsAndLocation.season`, e)
              }
            />
          </div>
        );
      },
    },
    {
      title: "مقدار حداکثر",
      dataIndex: "iranCities",
      key: "iranCities",
      render: (value, record) => (
        <div>
          <Input
            className="max-w-[70px]"
            type="number"
            value={value}
            onChange={(e) =>
              handleCellChange(`timePeriodsAndLocation.iranCities`, e)
            }
          />
        </div>
      ),
    },
    {
      title: "این شرط استثنا باشد",
      dataIndex: "allTimePeriodsShouldBeTakenExceptDesignatedPeriod",
      key: "allTimePeriodsShouldBeTakenExceptDesignatedPeriod",
      render: (value, record) => (
        <div>
          <Checkbox
            checked={value}
            onChange={(e) => {
              handleCellChange(
                `timePeriodsAndLocation[${
                  record?.index - 1
                }].calculationOfTheFixedAmountBasedOnTheNumberOfGoods`,
                e.target.checked
              );
            }}
          />
        </div>
      ),
    },
    {
      title: "مناطق استثنا باشد",
      dataIndex: "allAreasExceptWhereSpecified",
      key: "allAreasExceptWhereSpecified",
      render: (value, record) => (
        <div>
          <Checkbox
            checked={value}
            onChange={(e) => {
              handleCellChange(
                `timePeriodsAndLocation[${
                  record?.index - 1
                }].allAreasExceptWhereSpecified`,
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
          <Input
            className="w-[50%]"
            value={value}
            onChange={(e) =>
              handleCellChange(
                `timePeriodsAndLocation.description`,
                e.target.value
              )
            }
          />
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
              className="flex gap-3 items-center min-w-[300px] md:min-w-[460px] mx-auto"
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
