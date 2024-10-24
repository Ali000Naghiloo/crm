import { Line } from "@ant-design/charts";
import { Calendar, Card } from "antd";
import { Link } from "react-router-dom";
import formatHelper from "../../helper/formatHelper";

export default function AdminDashboard() {
  const data = [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 13 },
  ];

  const props = {
    data,
    xField: formatHelper.toPersianString("year"),
    yField: "value",
  };

  return (
    <>
      <div className="max-w-pagesWidth w-full box-border flex flex-col gap-14 h-full m-5">
        {/* page title */}
        <div className="w-full flex justify-center items-center text-4xl font-bold pt-20">
          <h1>داشبورد</h1>
        </div>

        <div className="w-full flex flex-col gap-5 md:pt-10">
          <h1 className="text-2xl font-bold">به پنل مدیریتی خوش آمدید!</h1>

          <div className="w-full flex gap-10 flex-wrap overflow-x-auto">
            <Card
              className="min-w-[300px] mx-auto bg-green-500 text-white"
              title={
                <div className="text-white ml-5">
                  یادآور های تنظیم شده برای امروز
                </div>
              }
              extra={<Link to={"/"}>بیشتر</Link>}
            >
              <div className="min-h-[200px] flex justify-center items-center">
                <span>یادآوری برای امروز تنظیم نکرده اید!</span>
              </div>
            </Card>

            <Card
              className="min-w-[300px] mx-auto bg-blue-500 text-white"
              title={<div className="text-white ml-5">کار های برای پیگیری</div>}
              extra={<Link to={"/"}>بیشتر</Link>}
            >
              <div className="min-h-[200px] flex justify-center items-center">
                <span>کاری برای پیگیری ندارید!</span>
              </div>
            </Card>

            <Card
              className="min-w-[300px] mx-auto bg-red-500 text-white"
              title={<div className="text-white ml-5">تیکت ها</div>}
              extra={<Link to={"/"}>بیشتر</Link>}
            >
              <div className="min-h-[200px] flex justify-center items-center">
                <span>تیکتی برای پاسخگویی وجود ندارد!</span>
              </div>
            </Card>

            <Card
              className="w-full mx-auto bg-gray-500 text-white"
              title={<div className="text-white ml-5">تقویم</div>}
              extra={<Link to={"/"}>بیشتر</Link>}
            >
              <div className="min-h-[200px] flex justify-center items-center">
                <Calendar className="max-w-[100%]" />
              </div>
            </Card>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <h2 className="text-2xl font-bold">میزان فروش در هفته اخیر</h2>

          <div className="w-full">
            <Line {...props} />
          </div>
        </div>
      </div>
    </>
  );
}
