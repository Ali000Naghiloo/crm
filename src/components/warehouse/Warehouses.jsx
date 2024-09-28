import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageRoutes from "../../common/PageRoutes";
import { setPageRoutes } from "../../store/reducers/pageRoutes";
import useHttp from "../../hooks/useHttps";
import { Button, Popconfirm, Table } from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
// import CreateWarehouse from "./create warehouse/CreateWarehouse";
import WarehouseModal from "./warehouse data/WarehouseModal";
import { convertISOToDate } from "../../hooks/functions";

export default function Warehouses() {
  const dispatch = useDispatch();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dataModal, setDataModal] = useState({
    open: false,
    data: null,
    id: null,
  });
  const [createModal, setCreateModal] = useState({
    open: false,
    id: null,
  });
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  // imports
  // const WarehouseModal = lazy(() => import("./warehouse data/WarehouseModal"));
  const CreateWarehouse = lazy(() =>
    import("./create warehouse/CreateWarehouse")
  );

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "نام",
      dataIndex: "warehouseName",
      key: "warehouseName",
    },
    {
      title: "نوع",
      dataIndex: "warehouseType",
      render: (value) => <div>{allEnum?.WarehouseType[value]}</div>,
      key: "warehouseType",
    },
    {
      title: "وضعیت",
      dataIndex: "warehouseStatus",
      render: (value) => <div>{allEnum?.WarehouseStatus[value]}</div>,
      key: "warehouseStatus",
    },
    {
      title: "کد",
      dataIndex: "warehouseManualCode",
      key: "warehouseManualCode",
    },
    {
      title: "تاریخ تاسیس",
      dataIndex: "establishedDate",
      render: (value) => <div>{value ? convertISOToDate(value) : "-"}</div>,
      key: "establishedDate",
    },
    {
      title: "فعال؟",
      dataIndex: "isActive",
      render: (value) => (
        <>
          {value ? (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
          )}
        </>
      ),
      key: "isActive",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              setDataModal({ data: data, open: true, id: data?.warehouseId })
            }
            size="middle"
            type="primary"
          >
            مشاهده
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این انبار اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.warehouseId)}
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
      .get("/Warehouse/DeleteWarehouse", {
        params: { warehouseId: id },
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
      .get("/Warehouse/GetAllWarehouses")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.warehouseViewModelList.map((data, index) => {
            datas.push({ ...data, index: index + 1, key: index });
          });
          setPageList(datas);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    dispatch(setPageRoutes([{ label: "انبار" }, { label: "لیست انبار ها" }]));

    handleGetList();
  }, []);

  return (
    <Suspense fallback={<></>}>
      <div className="w-full min-h-pagesHeight p-2 md:p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>انبار ها</h1>

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
            onClick={() => setCreateModal({ open: true })}
          >
            ساخت انبار جدید
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
          />
        </div>
      </div>

      <WarehouseModal
        open={dataModal.open}
        setOpen={(e) => {
          setDataModal({
            ...dataModal,
            open: e,
          });
        }}
        data={dataModal.data}
        id={dataModal.id}
        list={pageList}
        getNewList={handleGetList}
      />

      <CreateWarehouse
        open={createModal.open}
        setOpen={(e) => {
          setCreateModal({
            ...createModal,
            open: e?.target?.value,
          });
        }}
        getNewList={handleGetList}
        list={pageList}
      />
    </Suspense>
  );
}
