import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageRoutes from "../../../common/PageRoutes";
import { setPageRoutes } from "../../../store/reducers/pageRoutes";
import useHttp from "../../../hooks/useHttps";
import { Button, Popconfirm, Skeleton, Table, Tag, Tree } from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
import formatHelper from "../../../helper/formatHelper";
import CreateGroup from "./CreateGroup";
import UpdateGroup from "./UpdateGroup";
import { BsPerson } from "react-icons/bs";

const compareChildrens = (groups) => {
  const groupMap = {};

  // Create a map of groups by their ID
  groups.forEach((group) => {
    groupMap[group.id] = { ...group, children: [] };
  });

  // Iterate through the groups and assign children to their respective parents
  groups.forEach((group) => {
    if (group.parentGroupId !== null) {
      groupMap[group.parentGroupId].children.push(groupMap[group.id]);
    }
  });

  // Extract the top-level groups (those without a parent)
  const organizedGroups = groups
    .filter((group) => group.parentGroupId === null)
    .map((group) => groupMap[group.id]);

  return organizedGroups;
};
const skeleton = [{}, {}, {}, {}, {}, {}, {}];

export default function Groups() {
  const dispatch = useDispatch();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
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

  // const allEnum = useSelector((state) => state.allEnum.allEnum);

  // const columns = [
  //   {
  //     title: "ردیف",
  //     dataIndex: "index",
  //     sorter: (a, b) => a.index - b.index,
  //     key: "index",
  //   },
  //   {
  //     title: "نام گروه",
  //     dataIndex: "title",
  //     key: "title",
  //   },
  //   {
  //     title: "نوع گروه",
  //     dataIndex: "customerGroupType",
  //     render: (value) => <div>{allEnum?.CustomerGroupType[value]}</div>,
  //     key: "customerGroupType",
  //   },
  //   {
  //     title: "اعضای گروه",
  //     dataIndex: "customerGroupCustomers",
  //     width: "250px",
  //     render: (value) => {
  //       return (
  //         <>
  //           {value && value?.length !== 0 ? (
  //             value?.length < 5 ? (
  //               <div className="w-full flex justify-start gap-1 flex-wrap">
  //                 {value?.map((cu, index) => {
  //                   return (
  //                     <Tag key={index} color="blue" className="m-0">
  //                       {cu.customer}
  //                     </Tag>
  //                   );
  //                 })}
  //               </div>
  //             ) : (
  //               <div className="w-full flex justify-start gap-1 flex-wrap">
  //                 {value?.map((cu, index) => {
  //                   if (index < 5) {
  //                     return (
  //                       <Tag key={index} color="blue" className="m-0">
  //                         {cu.customer}
  //                       </Tag>
  //                     );
  //                   }
  //                 })}
  //                 <Tag color="blue-inverse">... +</Tag>
  //               </div>
  //             )
  //           ) : (
  //             <div className="">-</div>
  //           )}
  //         </>
  //       );
  //     },
  //     key: "customerGroupCustomers",
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
  //           اطلاعات تکمیلی
  //         </Button>
  //         <Popconfirm
  //           cancelText="لغو"
  //           okText="حذف"
  //           title="آیا از حذف این شخص اطمینان دارید؟"
  //           placement="topRight"
  //           onConfirm={() => handleDelete(data?.id)}
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

  const onSelect = (selectedKeys, info) => {
    setDataModal({
      open: true,
      data: info?.node,
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);

    await httpService
      .get("/CustomerGroup/DeleteCustomerGroup", {
        params: { customerGroupId: id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1)
          toast.success("با موفقیت حذف شد");
      })
      .catch(() => {});

    handleGetList();
    setLoading(false);
  };

  const handleGetList = async () => {
    setLoading(true);

    await httpService
      .post("/CustomerGroup/CustomerGroups")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          const formattedArray = [];
          res.data.customerGroupViewModelList?.map((group, index) => {
            formattedArray.push({
              ...group,
              key: group?.id,
              icon: <BsPerson />,
            });
          });
          console.log(formattedArray);
          setPageList(formattedArray);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      setPageRoutes([{ label: "اشخاص" }, { label: "فهرست گروه اشخاص" }])
    );

    handleGetList();
  }, []);

  return (
    <>
      <div className="w-full h-full p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>گروه ها</h1>

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
            تعریف گروه جدید
          </Button>
        </div>

        {/* content */}
        <div className="w-full">
          {/* <Table
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
                <div className="flex flex-col">
                  <p>توضیحات : </p>
                  <p>{record?.description}</p>
                </div>
              ),
            }}
          /> */}

          {!loading ? (
            <Tree
              treeData={pageList}
              fieldNames={{
                title: "groupName",
                value: "id",
                children: "subGroups",
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

      <UpdateGroup
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

      <CreateGroup
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
    </>
  );
}
