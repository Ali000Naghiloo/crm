import DatePicker, {
  utils,
} from "@hassanmojab/react-modern-calendar-datepicker";
import { Input } from "antd";
import { useEffect, useState } from "react";
import { convertDateToISO, convertISOToDate } from "../hooks/functions";

export default function MyDatePicker({
  value,
  setValue,
  className,
  status,
  untilToday,
  placeholder,
  reange,
}) {
  const [localValue, setLocalValue] = useState(null);

  useEffect(() => {
    if (value) setLocalValue(convertISOToDate(value));
    // console.log(value);
  }, [value]);

  useEffect(() => {
    // console.log(localValue);
  }, [localValue]);

  useEffect(() => {
    setLocalValue(null);
  }, []);

  return (
    <div className="w-full">
      <DatePicker
        style={{ width: "100%", zIndex: "10" }}
        locale={"fa"}
        maximumDate={untilToday ? utils("fa").getToday() : null}
        value={null}
        onChange={(e) => {
          setValue(convertDateToISO(`${e?.year}/${e?.month}/${e?.day}`));
          // console.log(convertDateToISO(`${e?.year}/${e?.month}/${e?.day}`));
        }}
        shouldHighlightWeekends
        calendarClassName="custom-calendar"
        renderInput={({ ref }) => {
          const date = localValue;
          return (
            <Input
              className={`${className}`}
              ref={ref}
              value={date ? `${date}` : null}
              status={status}
              style={{ zIndex: "0" }}
              placeholder={placeholder ? placeholder : "تاریخ را انتخاب کنید"}
            />
          );
        }}
      />
    </div>
  );
}
