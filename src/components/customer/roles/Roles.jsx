import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageRoutes from "../../../common/PageRoutes";
import { setPageRoutes } from "../../../store/reducers/pageRoutes";
import useHttp from "../../../hooks/useHttps";
import { Button, Popconfirm, Skeleton, Table, Tree } from "antd";
import CustomerModal from "../customer data/CustomerModal";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
import formatHelper from "../../../helper/formatHelper";
import CreateRole from "./CreateRole";
import UpdateRole from "./UpdateRole";

export default function Roles() {
  const dispatch = useDispatch();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [allItems, setAllItems] = useState(null);
  // table
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [dataModal, setDataModal] = useState({
    open: false,
    data: null,
  });

  const [createModal, setCreateModal] = useState({
    open: false,
    id: null,
  });
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const columns = [
    {
      title: "ایدی",
      dataIndex: "customerRoleId",
      key: "customerRoleId",
    },
    {
      title: "نام نقش",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "توضیحات",
      dataIndex: "description",
      render: (value) => <div>{formatHelper.cutString(value, 40)}</div>,
      key: "description",
    },
    {
      title: "نام سردسته",
      dataIndex: "parentCustomerRoleId",
      render: (value) => (
        <>
          {value ? (
            <div className="">
              {allItems
                ? allItems.map((role) => {
                    if (role.customerRoleId === value) {
                      return `${role.roleName}`;
                    }
                  })
                : null}
            </div>
          ) : (
            <div className="">-</div>
          )}
        </>
      ),
      key: "parentName",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button
            onClick={() => setDataModal({ data: data, open: true })}
            size="middle"
            type="primary"
          >
            اطلاعات تکمیلی
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این نقش اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.customerRoleId)}
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

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPerPage(pagination.pageSize);
  };

  const handleGetList = async () => {
    setLoading(true);

    await httpService
      .get("/CustomerRole/GetAllCustomerRoles")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          const datas = [];
          res.data.customerRoleList?.map((role, index) => {
            datas.push({
              ...role,
              index: index + 1,
              key: role?.customerRoleId,
            });
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
        { label: "CRM" },
        { label: "اشخاص" },
        { label: "فهرست نقش اشخاص" },
      ])
    );

    handleGetList();
  }, []);

  useEffect(() => {
    console.log(pageList);
  }, [pageList]);

  return (
    <>
      <div className="w-full min-h-pagesHeight p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>نقش ها</h1>

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
            تعریف نقش جدید
          </Button>
        </div>

        {/* content */}
        <div className="w-full py-5 overflow-x-auto">
          <Table
            bordered
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

      <UpdateRole
        open={dataModal.open}
        setOpen={(e) => {
          setDataModal({
            ...dataModal,
            open: e?.target?.value,
          });
        }}
        data={dataModal.data}
        list={pageList}
        getNewList={handleGetList}
      />

      <CreateRole
        open={createModal.open}
        setOpen={(e) => {
          setCreateModal({
            ...createModal,
            open: e?.target?.value,
          });
        }}
        getNewList={handleGetList}
        list={pageList}
        expandable={{
          expandedRowRender: (record) => (
            <div className="w-full flex flex-col gap-3">
              {record.children.length !== 0
                ? record.children.map((ch, index) => <>{ch?.roleName}</>)
                : "فرزندی ندارد"}
            </div>
          ),
        }}
      />
    </>
  );
}
