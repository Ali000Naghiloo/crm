import { Button, Input, Modal, Spin, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import useHttp from "../../../hooks/useHttps";
import logo from "../../../assets/images/logo.svg";
import moment from "jalali-moment";
import formatHelper from "../../../helper/formatHelper";
import { useReactToPrint } from "react-to-print";

// factorTypes =
// 2 = پیش فاکتور
// 3 = فاکتور فروش
// 4 = فاکتور برگشت از فروش

export default function ViewFactor({ open, setOpen, factorId }) {
  const { httpService } = useHttp();
  const [factorData, setFactorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalCondition, setTotalCondition] = useState(0);
  const ref = useRef(null);

  const columns = [
    { title: "ردیف", dataIndex: "itemRow", key: "itemRow" },
    { title: "کالا و خدمات", dataIndex: "product", key: "product" },
    { title: "تعداد/مقدار", dataIndex: "quantity", key: "quantity" },
    {
      title: "مبلغ واحد",
      dataIndex: "productUnitPrice",
      key: "productUnitPrice",
      render: (value) => <>{value ? formatHelper.numberSeperator(value) : 0}</>,
    },
    {
      title: "تخفیف",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "مبلغ کل",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => <>{value ? formatHelper.numberSeperator(value) : 0}</>,
    },
  ];

  const conditionsColumns = [
    { title: "ردیف", dataIndex: "itemRow", key: "itemRow" },
    {
      title: "عنوان اضافه کسری",
      dataIndex: "factorAdditionsAndDeductions",
      key: "factorAdditionsAndDeductions",
    },
    { title: "مقدار", dataIndex: "amount", key: "amount" },
  ];

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const handlePrint = useReactToPrint({ contentRef: ref });

  const handleGetFactorData = async () => {
    setLoading(true);
    const formData = {
      factorId: factorId,
    };

    await httpService
      .get("/Factor/GetFactorDetail", { params: formData })
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          setFactorData(res.data?.factorDetailViewModel);
          let totalConditions = 0;
          res.data?.factorDetailViewModel?.factorItems?.map((c) => {
            totalConditions += parseFloat(c?.totalPrice);
          });
          setTotalCondition(totalConditions);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    if (factorId) {
      handleGetFactorData();
    }
  }, [open, factorId]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        // title={`فاکتور شماره : ${factorData ? factorData?.factorNumber : ""}`}
        className="w-fit lg:min-w-[900px]"
        footer={<></>}
      >
        {/* container */}
        <div className="w-full flex flex-col">
          {/* options */}
          <div className="w-full flex flex-col mt-10">
            <Button onClick={handlePrint} size="large" type="primary">
              پرینت
            </Button>
          </div>

          {/* factor container */}
          {factorData && (
            <div
              ref={ref}
              className="w-full flex flex-col gap-14 border mt-10 p-3 rounded-md relative"
            >
              {/* factor header */}
              <div className="w-full flex justify-between">
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-gray-500">مسئول فاکتور :</span>
                    <span className="text-lg font-bold">
                      {factorData?.factorResponsibles[0]?.user}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">به نام : </span>
                    <span className="text-lg font-bold">
                      {factorData?.customer}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 absolute top-10px left-[50%] translate-x-[-50%]">
                  <div className="w-[120px] bg-accent rounded-lg">
                    <img
                      src={logo}
                      alt="logo"
                      className="object-contain w-full"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">گرانتیل</h1>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-gray-500">تاریخ فاکتور :</span>
                    <span className="text-lg font-bold">
                      {factorData?.factorDate
                        ? moment(factorData?.factorDate)
                            .locale("fa")
                            .format("YYYY/MM/DD")
                        : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">شماره فاکتور : </span>
                    <span className="text-lg font-bold">
                      {factorData?.factorNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* factor body */}
              <div className="w-full mt-10">
                {factorData?.factorItems &&
                factorData?.factorItem?.length !== 0 ? (
                  <div className="w-full">
                    <Table
                      size="small"
                      bordered
                      dataSource={factorData?.factorItems}
                      columns={columns}
                      pagination={{
                        position: ["none"],
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full flex justify-center items-center">
                    <span>در این فاکتور هیچ کالا و خدماتی قید نشده است!</span>
                  </div>
                )}
              </div>

              {/* factor footer */}
              <div className="w-full flex flex-col">
                {/* factor price */}
                <div className="w-full flex justify-center items-center gap-2">
                  <span className="text-gray-500">مبلغ کل فاکتور : </span>
                  <span className="text-lg font-bold">
                    {formatHelper.numberSeperator(parseFloat(totalCondition))}
                  </span>
                </div>

                {/* factor conditions */}
                <div className="w-full my-10 flex flex-col items-center">
                  <span className="text-2xl font-bold">جدول اضافات کسورات</span>
                  <Table
                    pagination={{ position: ["none"] }}
                    className="w-full"
                    size="small"
                    dataSource={
                      factorData?.factorAdditionsAndDeductionsMappings
                    }
                    columns={conditionsColumns}
                  />
                </div>

                {/* payable */}
                <div className="w-full flex justify-center items-center gap-2">
                  <span className="">مبلغ قابل پرداخت : </span>
                  <span className="text-lg font-bold">
                    {formatHelper.numberSeperator(factorData?.totalFactorPrice)}
                  </span>
                </div>

                {/* factor description */}
                <div className="w-full">
                  <span>توضیحات : </span>
                  <Input.TextArea value={""} rows={3} />
                </div>

                {/* sign place */}
                <div className="w-full flex justify-between">
                  <div className="p-20 flex justify-center items-center">
                    <span className="text-gray-500">محل امضای مسئول</span>
                  </div>

                  <div className="p-20 flex justify-center items-center">
                    <span className="text-gray-500">
                      محل امضای دریافت کننده
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="w-full flex justify-center items-center my-10">
              <Spin></Spin>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
