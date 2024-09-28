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
import { BsPerson } from "react-icons/bs";
import { GrDown } from "react-icons/gr";

const compareChildrens = (roles) => {
  const roleMap = {};

  // Create a map of roles by their ID
  roles.forEach((role) => {
    roleMap[role.customerRoleId] = { ...role, children: [] };
  });

  // Iterate through the roles and assign children to their respective parents
  roles.forEach((role) => {
    if (role.parentCustomerRoleId !== null) {
      roleMap[role.parentCustomerRoleId].children.push(
        roleMap[role.customerRoleId]
      );
    }
  });

  // Extract the top-level roles (those without a parent)
  const organizedRoles = roles
    .filter((role) => role.parentCustomerRoleId === null)
    .map((role) => roleMap[role.customerRoleId]);

  return organizedRoles;
};

export default function Roles() {
  const skeleton = [{}, {}, {}, {}, {}, {}, {}];
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
  //   const allEnum = useSelector((state) => state.allEnum.allEnum);

  // const columns = [
  //   {
  //     title: "ایدی",
  //     dataIndex: "customerRoleId",
  //     key: "customerRoleId",
  //   },
  //   {
  //     title: "نام نقش",
  //     dataIndex: "roleName",
  //     key: "roleName",
  //   },
  //   {
  //     title: "توضیحات",
  //     dataIndex: "description",
  //     render: (value) => <div>{formatHelper.cutString(value, 40)}</div>,
  //     key: "description",
  //   },
  //   {
  //     title: "نام سردسته",
  //     dataIndex: "parentCustomerRoleId",
  //     render: (value) => (
  //       <>
  //         {value ? (
  //           <div className="">
  //             {allItems
  //               ? allItems.map((role) => {
  //                   if (role.customerRoleId === value) {
  //                     return `${role.roleName}`;
  //                   }
  //                 })
  //               : null}
  //           </div>
  //         ) : (
  //           <div className="">-</div>
  //         )}
  //       </>
  //     ),
  //     key: "parentName",
  //   },
  //   {
  //     title: "عملیات",
  //     render: (data) => (
  //       <div className="flex gap-2">
  //         <Button
  //           onClick={() => setDataModal({ data: data, open: true })}
  //           size="middle"
  //           type="primary"
  //         >
  //           مشاهده
  //         </Button>
  //         <Popconfirm
  //           cancelText="لغو"
  //           okText="حذف"
  //           title="آیا از حذف این شخص اطمینان دارید؟"
  //           placement="topRight"
  //           onConfirm={() => handleDelete(data?.customerRoleId)}
  //         >
  //           <Button size="middle" type="primary" danger>
  //             حذف
  //           </Button>
  //         </Popconfirm>
  //       </div>
  //     ),
  //     key: "actions",
  //   },
  // ];

  // const handleTableChange = (pagination) => {
  //   setCurrentPage(pagination.current);
  //   setPerPage(pagination.pageSize);
  // };

  const handleGetList = async () => {
    setLoading(true);

    await httpService
      .get("/CustomerRole/GetAllCustomerRoles")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          const formattedArray = [];
          setAllItems(res.data.customerRoleList);
          res.data.customerRoleList?.map((role, index) => {
            formattedArray.push({
              ...role,
              key: role?.customerRoleId,
              icon: <BsPerson />,
            });
          });
          let datas = compareChildrens(formattedArray);
          setPageList(datas);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const onSelect = (selectedKeys, info) => {
    // console.log("selected", selectedKeys, info);
    setDataModal({
      open: true,
      data: info?.node,
    });
  };

  useEffect(() => {
    dispatch(
      setPageRoutes([
        { label: "CRM" },
        { label: "اشخاص" },
        { label: "لیست نقش اشخاص" },
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
            ساخت نقش جدید
          </Button>
        </div>

        {/* content */}
        <div className="w-full py-5 overflow-x-auto">
          {/* <Table
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
          /> */}

          {!loading ? (
            <Tree
              treeData={pageList}
              fieldNames={{
                title: "roleName",
                value: "customerRoleId",
                children: "children",
              }}
              showLine
              className="text-2xl"
              // switcherIcon={<GrDown />}
              onSelect={onSelect}
              defaultExpandAll
            />
          ) : (
            <div className="w-full h-[500px] flex flex-col justify-start gap-3 items-center">
              {skeleton.map((s, index) => (
                <Skeleton.Input active block key={index}></Skeleton.Input>
              ))}
            </div>
          )}
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
