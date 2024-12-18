import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageRoutes from "../../common/PageRoutes";
import { setPageRoutes } from "../../store/reducers/pageRoutes";
import useHttp from "../../hooks/useHttps";
import { Button, Input, Popconfirm, Table, Tag } from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
import CreatePermission from "./PermissionModal";
import { FaUsers } from "react-icons/fa";

export default function Permissions() {
  const dispatch = useDispatch();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [permissionModal, setPermissionModal] = useState({
    open: false,
    id: null,
    data: null,
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
      title: "نام دسترسی",
      dataIndex: "menuAccessGroupName",
      key: "menuAccessGroupName",
    },
    {
      title: "نوع دسترسی",
      dataIndex: "claimType",
      render: (value) => <>{allEnum?.ClaimType[value]}</>,
      key: "claimType",
    },
    {
      title: "منو های در دسترس",
      dataIndex: "groupMenuAccesses",
      render: (value) => (
        <>
          {!!value?.length
            ? value?.map((v) => <Tag color="blue">{v?.name}</Tag>)
            : "-"}
        </>
      ),
      key: "groupMenuAccesses",
    },
    {
      title: "توضیحات",
      dataIndex: "description",
      render: (value) => <>{value}</>,
      key: "description",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              setPermissionModal({
                id: data?.customerId,
                open: true,
                data: data,
              })
            }
            size="middle"
            type="primary"
          >
            اطلاعات تکمیلی
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این دسترسی اطمینان دارید؟"
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
      .get("/AccessClaim/MenuAccessGroups")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.menuAccessGroupViewModelList.map((data, index) => {
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
    handleGetList();
  }, []);

  return (
    <>
      <div className="w-full h-full p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>لیست دسترسی کاربران</h1>

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
            onClick={() => setPermissionModal({ open: true })}
          >
            اختصاص دسترسی به گروه کاربران <FaUsers />
          </Button>
        </div>

        {/* filter bar */}
        <div className="w-full mt-10"> </div>

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

      <CreatePermission
        open={permissionModal.open}
        setOpen={(e) => setPermissionModal({ open: e })}
        data={permissionModal.data}
        getNewList={handleGetList}
      />
    </>
  );
}
