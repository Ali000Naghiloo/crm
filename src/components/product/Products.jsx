import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageRoutes from "../../common/PageRoutes";
import { setPageRoutes } from "../../store/reducers/pageRoutes";
import useHttp from "../../hooks/useHttps";
import { Button, Input, Popconfirm, Table } from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
import CreateProduct from "./create product/CreateProduct";
import ProductModal from "./product data/ProductModal";
import { convertISOToDate } from "../../hooks/functions";
import moment from "jalali-moment";

export default function Products() {
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
  const [filters, setFilters] = useState({ keyword: "" });
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  // imports
  // const ProductModal = lazy(() => import("./product data/ProductModal"));
  // const CreateProduct = lazy(() => import("./create product/CreateProduct"));

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "نام",
      render: (datas) => (
        <div className="flex gap-1">
          {datas?.productName} {datas?.latinName ? `(${datas?.latinName})` : ""}
        </div>
      ),
      key: "productName",
    },
    {
      title: "دسته بندی",
      dataIndex: "productCategory",
      key: "productCategory",
    },
    {
      title: "نوع",
      dataIndex: "natureOfProduct",
      render: (value) => <div>{allEnum?.NatureOfProduct[value]}</div>,
      key: "natureOfProduct",
    },
    {
      title: "خدماتی؟",
      dataIndex: "serviceProduct",
      render: (value) => <div>{value ? "بله" : "خیر"}</div>,
      key: "serviceProduct",
    },
    {
      title: "تاریخ تولید",
      dataIndex: "manufactureDate",
      render: (value) => (
        <div>
          {value ? moment.utc(value).locale("fa").format("YYYY/MM/DD") : "-"}
        </div>
      ),
      key: "manufactureDate",
    },
    {
      title: "کد کالا و خدمات",
      dataIndex: "productCode",
      key: "productCode",
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
              setDataModal({ data: data, open: true, id: data?.productId })
            }
            size="middle"
            type="primary"
          >
            اطلاعات تکمیلی
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این کالا و خدمات اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.productId)}
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
      .get("/Product/DeleteProduct", {
        params: { productId: id },
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
      .get("/Product/GetAllProducts")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.productViewModelList.map((data, index) => {
            datas.push({ ...data, index: index + 1, key: index });
          });
          setPageList(datas);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleGetListByKeyword = async () => {
    setLoading(true);
    const formData = {
      keyword: filters.keyword,
    };

    await httpService
      .get("/Product/SearchProducts", { params: formData })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.productViewModelList.map((data, index) => {
            datas.push({ ...data, index: index + 1, key: index });
          });
          setPageList(datas);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      setPageRoutes([
        { label: "کالا و خدمات ها" },
        { label: "فهرست کالا و خدمات ها" },
      ])
    );

    handleGetList();
  }, []);

  useEffect(() => {
    if (filters.keyword.length !== 0) {
      const timeoutId = setTimeout(() => {
        handleGetListByKeyword();
      }, 1000);
      setFilters({ ...filters, loading: false });
      return () => clearTimeout(timeoutId);
    } else {
      handleGetList();
      setFilters({ ...filters, loading: false });
    }
  }, [filters.keyword]);

  return (
    <Suspense fallback={<></>}>
      <div className="w-full h-full p-2 md:p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>کالا و خدمات</h1>

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
            تعریف کالا/خدمات جدید
          </Button>
        </div>

        {/* filter bar */}
        <div className="w-full mt-10">
          <Input.Search
            className="w-full"
            size="large"
            variant="filled"
            placeholder="برای جستجو در مشخصات کالا و خدمات شروع به نوشتن کنید..."
            loading={filters.loading}
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ loading: true, keyword: e.target.value })
            }
            allowClear
          />
        </div>

        {/* content */}
        <div className="max-w-[100%] py-5 overflow-x-auto">
          <Table
            className="w-full bg-white"
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

                  <div className="flex gap-2">
                    <b>شماره سریال : </b>
                    <p>
                      {record?.ProductSerialNumber
                        ? record?.ProductSerialNumber
                        : "-"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <b>شماره کالا در انبار :</b>
                    <p>{record?.sku ? record?.sku : "-"}</p>
                  </div>

                  <div className="flex gap-2">
                    <b>شروط نگهداری :</b>
                    <p>
                      {record?.storageConditions
                        ? record?.storageConditions
                        : "-"}
                    </p>
                  </div>
                </div>
              ),
            }}
          />
        </div>
      </div>

      <ProductModal
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

      <CreateProduct
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
