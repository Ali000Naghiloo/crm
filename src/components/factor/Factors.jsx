import { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../hooks/useHttps";
import { Button, Popconfirm, Table, Tag } from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
// import CreateFactor from "./create factor/CreateFactor";
// import PriceModal from "./price data/PriceModal";
import { setPageRoutes } from "../../store/reducers/pageRoutes";
import PageRoutes from "../../common/PageRoutes";
import { useNavigate } from "react-router-dom";
import formatHelper from "../../helper/formatHelper";
// import ViewFactor from "./view factor/ViewFactor";

// pageType {
//   0 : "فاکتور",
//   1 : "پیش فاکتور",
//   2 : "فاکتور برگشت از فروش",
// }

export default function Factors({ pageType }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showFactor, setShowFactor] = useState({
    open: false,
    id: null,
  });
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  // imports
  const ViewFactor = lazy(() => import("./view factor/ViewFactor"));

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "شماره فاکتور",
      dataIndex: "factorNumber",
      sorter: (a, b) => a.factorNumber - b.factorNumber,
      key: "factorNumber",
    },
    {
      title: "شخص",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "نوع",
      dataIndex: "factorType",
      render: (value) => <>{allEnum?.FactorType[value]}</>,
      key: "factorType",
    },
    {
      title: "مسئولین فاکتور",
      dataIndex: "factorResponsibles",
      render: (value) => (
        <>
          {value && value?.length !== 0
            ? value?.map((v, index) => (
                <Tag color="cyan-inverse" key={index}>
                  {v?.user}
                </Tag>
              ))
            : "-"}
        </>
      ),
      key: "factorResponsibles",
    },
    {
      title: "قیمت کل فاکتور",
      dataIndex: "totalFactorPrice",
      render: (value) => <>{value ? formatHelper.numberSeperator(value) : 0}</>,
      key: "totalFactorPrice",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setShowFactor({ id: data?.factorId, open: true });
            }}
            size="middle"
            type="primary"
          >
            اطلاعات تکمیلی
          </Button>
          <Button
            onClick={() => {
              navigate("/factors/create", {
                state: {
                  type: pageType,
                  data: data,
                  id: data?.factorId,
                },
              });
            }}
            size="middle"
            type="primary"
          >
            ویرایش
          </Button>
          <Popconfirm
            cancelText="خیر"
            okText="بله"
            title="آیا از حذف این فاکتور اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.factorId)}
          >
            <Button size="middle" type="primary" danger>
              حذف
            </Button>
          </Popconfirm>
        </div>
      ),
      key: "actions",
    },
  ];

  const handleDelete = async (id) => {
    setLoading(true);

    await httpService
      .get("/Factor/DeleteFactor", {
        params: { factorId: id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1)
          toast.success("با موفقیت حذف شد");
      })
      .catch(() => {});

    handleGetList();
    setLoading(false);
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPerPage(pagination.pageSize);
  };

  const handleGetList = async () => {
    setLoading(true);

    await httpService
      .get("/Factor/GetAllFactors")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.factorViewModelList.map((data, index) => {
            if (data?.factorType === pageType) {
              datas.push({ ...data, index: index + 1, key: data?.id });
            }
          });
          setPageList(datas);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const renderPageTitle = () => {
    if (pageType === 0) {
      return "درخواست کالا";
    }
    if (pageType === 2) {
      return "فهرست پیش فاکتور";
    }
    if (pageType === 3) {
      return "فهرست فاکتور فروش";
    }
    if (pageType === 4) {
      return "فهرست فاکتور های برگشت از فروش";
    }
  };

  useEffect(() => {
    dispatch(
      setPageRoutes([{ label: "فاکتور ها" }, { label: "فهرست فاکتور ها" }])
    );

    handleGetList();
  }, []);

  return (
    <Suspense fallback={<></>}>
      <div className="w-full h-full p-2 md:p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>{renderPageTitle()}</h1>

          <div className="flex items-center justify-center pl-5">
            <Button className="p-1" type="text" onClick={handleGetList}>
              <HiRefresh size={"2em"} />
            </Button>
          </div>
        </div>

        {/* routes */}
        <div>
          <PageRoutes />
        </div>

        {/* options */}
        <div className="flex flex-col gap-5 py-5">
          {/* <Button className="w-full" type="primary" size="large">
            خروجی جدول
          </Button> */}
          <Button
            className="w-full"
            type="primary"
            size="large"
            onClick={() =>
              navigate("/factors/create", {
                state: {
                  type: pageType,
                  customerId: null,
                  factorId: null,
                  data: null,
                },
              })
            }
          >
            {pageType ? allEnum?.FactorType[pageType] : null} جدید
          </Button>
        </div>

        {/* content */}
        <div className="max-w-[100%] py-5 overflow-x-auto">
          <Table
            className="max-w-full"
            loading={loading}
            columns={columns}
            dataSource={pageList}
            pagination={{
              position: ["bottomRight"],
              current: currentPage,
              pageSize: perPage,
              total: pageList ? pageList.length : 0,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30", "50"],
            }}
            onChange={handleTableChange}
            expandable={{
              expandedRowRender: (record) => (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <b>توضیحات : </b>
                    <p>{record?.description}</p>
                  </div>
                </div>
              ),
            }}
          />
        </div>
      </div>

      <ViewFactor
        open={showFactor.open}
        setOpen={(e) => {
          setShowFactor({ open: e });
        }}
        factorId={showFactor.id}
      />
    </Suspense>
  );
}
