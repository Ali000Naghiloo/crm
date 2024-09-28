import { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../hooks/useHttps";
import { Button, Popconfirm, Table } from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
// import CreateFactor from "./create factor/CreateFactor";
// import PriceModal from "./price data/PriceModal";
import { setPageRoutes } from "../../store/reducers/pageRoutes";
import PageRoutes from "../../common/PageRoutes";

// pageType {
//   0 : "فاکتور",
//   1 : "پیش فاکتور",
//   2 : "فاکتور برگشت از فروش",
// }

export default function Factors({ pageType }) {
  const dispatch = useDispatch();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showModal, setShowModal] = useState({
    open: false,
    data: null,
    id: null,
  });
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  // imports
  const CreateFactor = lazy(() => import("./create factor/CreateFactor"));

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
            ? value?.map((v, index) => <div key={index}>{"مسئول فاکتور"}</div>)
            : "-"}
        </>
      ),
      key: "factorResponsibles",
    },
    {
      title: "قیمت کل فاکتور",
      dataIndex: "totalFactorPrice",
      key: "totalFactorPrice",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              setShowModal({ data: data, open: true, id: data?.factorId })
            }
            size="middle"
            type="primary"
          >
            مشاهده
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این فاکتور اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.priceId)}
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
      .get("/Factor/Delete", {
        params: { priceId: id },
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
              datas.push({ ...data, index: index + 1, key: index });
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
      return "درخواست اولیه";
    }
    if (pageType === 2) {
      return "پیش فاکتور ها";
    }
    if (pageType === 3) {
      return "فاکتور ها";
    }
    if (pageType === 4) {
      return "فاکتور های مرجوعی";
    }
  };

  useEffect(() => {
    dispatch(
      setPageRoutes([{ label: "فاکتور ها" }, { label: "لیست فاکتور ها" }])
    );

    handleGetList();
  }, []);

  return (
    <Suspense fallback={<></>}>
      <div className="w-full min-h-pagesHeight p-2 md:p-5">
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
            onClick={() => setShowModal({ open: true })}
          >
            ساخت فاکتور جدید
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

      <CreateFactor
        open={showModal.open}
        setOpen={(e) => {
          setShowModal({
            ...showModal,
            open: e?.target?.value,
          });
        }}
        getNewList={handleGetList}
        data={showModal.data}
        factorId={showModal.id}
        list={pageList}
        type={pageType}
      />
    </Suspense>
  );
}
