import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageRoutes from "../../common/PageRoutes";
import { setPageRoutes } from "../../store/reducers/pageRoutes";
import useHttp from "../../hooks/useHttps";
import { Button, Input, Popconfirm, Table, Tag } from "antd";
import CustomerModal from "./customer data/CustomerModal";
import CreateCustomerModal from "./create customer/CreateCustomerModal";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";

export default function Customers() {
  const dispatch = useDispatch();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [customerDataModal, setCustomerDataModal] = useState({
    open: false,
    id: null,
  });
  const [createCustomerModal, setCreateCustomerModal] = useState({
    open: false,
    id: null,
  });
  const [filters, setFilters] = useState({
    keyword: "",
    loading: false,
  });
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "نام شخص",
      dataIndex: "customerName",
      onFilter: (value, record) => record.customerName.startsWith(value),
      key: "customerName",
    },
    {
      title: "نوع شخص",
      dataIndex: "customerType",
      showSorterTooltip: {
        target: "full-header",
      },
      render: (value) => (
        <div>
          {allEnum?.CustomerType[value] ? allEnum?.CustomerType[value] : "-"}
        </div>
      ),
      filters: allEnum
        ? allEnum?.CustomerType?.map((i, index) => {
            return { text: i, value: index };
          })
        : [],
      sorter: (a, b) => a.customerType - b.customerType,
      onFilter: (value, record) => {
        console.log(value, record);
      },
      key: "customerType",
    },
    {
      title: "نقش (ها)",
      dataIndex: "roleMappings",
      render: (value) => {
        if (value && value?.length !== 0) {
          return (
            <div className="flex gap-1 flex-wrap max-w-[170px]">
              {value?.map((v) => (
                <Tag color="blue" key={v?.customerId}>
                  {v?.customerRole}
                </Tag>
              ))}
            </div>
          );
        } else {
          return <>-</>;
        }
      },
      key: "roleMappings",
    },
    {
      title: "نوع شرکت",
      dataIndex: "companyType",
      render: (value) => (
        <div>
          {allEnum?.CompanyType[value] ? allEnum?.CompanyType[value] : "-"}
        </div>
      ),
      key: "companyType",
    },
    {
      title: "کد شخص",
      dataIndex: "customerCod",
      render: (value) => <div>{value}</div>,
      key: "customerCod",
    },
    {
      title: "فعال است؟",
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
              setCustomerDataModal({ id: data?.customerId, open: true })
            }
            size="middle"
            type="primary"
          >
            اطلاعات تکمیلی
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این شخص اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.customerId)}
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
      .get("/Customer/DeleteCustomer", { params: { customerId: id } })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت حذف شد");
        } else {
          toast.info(res.data.msg);
        }
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
      .get("/Customer/GetAllCustomers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.customerList.map((data, index) => {
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
      .get("/Customer/SearchCustomers", { params: formData })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.customerList.map((data, index) => {
            datas.push({ ...data, index: index + 1, key: index });
          });
          setPageList(datas);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    dispatch(setPageRoutes([{ label: "اشخاص" }, { label: "فهرست اشخاص" }]));
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
    <>
      <div className="w-full h-full p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>اشخاص</h1>

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
            onClick={() => setCreateCustomerModal({ open: true })}
          >
            تعریف شخص جدید
          </Button>
        </div>

        {/* filter bar */}
        <div className="w-full mt-10">
          <Input.Search
            className="w-full"
            size="large"
            variant="filled"
            placeholder="برای جستجو در مشخصات اشخاص شروع به نوشتن کنید..."
            loading={filters.loading}
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ loading: true, keyword: e.target.value })
            }
            allowClear
          />
        </div>

        {/* content */}
        <div className="w-full py-5 overflow-x-auto">
          <Table
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

      <CustomerModal
        open={customerDataModal.open}
        setOpen={(e) => {
          setCustomerDataModal({
            ...customerDataModal,
            open: e?.target?.value,
          });
        }}
        id={customerDataModal.id}
        getNewList={handleGetList}
      />

      <CreateCustomerModal
        open={createCustomerModal.open}
        setOpen={(e) => {
          setCreateCustomerModal({
            ...createCustomerModal,
            open: e?.target?.value,
          });
        }}
        getNewList={handleGetList}
      />
    </>
  );
}
