import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageRoutes from "../../../common/PageRoutes";
import { setPageRoutes } from "../../../store/reducers/pageRoutes";
import useHttp from "../../../hooks/useHttps";
import { Button, Popconfirm, Skeleton, Table, Tag, Tree } from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
import formatHelper from "../../../helper/formatHelper";
import CreateGroup from "./CreateCategory";
import UpdateGroup from "./UpdateCategory";

const compareChildrens = (roles) => {
  const roleMap = {};

  // Create a map of roles by their ID
  roles.forEach((role) => {
    roleMap[role.productCategoryId] = { ...role, children: [] };
  });

  // Iterate through the roles and assign children to their respective parents
  roles.forEach((role) => {
    if (role.parentCategoryId !== null) {
      roleMap[role.parentCategoryId].children.push(
        roleMap[role.productCategoryId]
      );
    }
  });

  // Extract the top-level roles (those without a parent)
  const organizedRoles = roles
    .filter((role) => role.parentCategoryId === null)
    .map((role) => roleMap[role.productCategoryId]);

  return organizedRoles;
};

export default function Categories() {
  const skeleton = [{}, {}, {}, {}, {}, {}, {}];
  const dispatch = useDispatch();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [dataModal, setDataModal] = useState({
    open: false,
    data: null,
  });
  const [createModal, setCreateModal] = useState({
    open: false,
    id: null,
  });
  // const allEnum = useSelector((state) => state.allEnum.allEnum);

  const columns = [
    {
      title: "ایدی",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "نام دسته بندی",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "نام دسته بندی والد",
      dataIndex: "parentCategory",
      render: (value) => (
        <div className="w-full flex justify-center">{value ? value : "-"}</div>
      ),
      key: "parentCategory",
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
            مشاهده
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این دسته بندی اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.productCategoryId)}
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
      .get("/ProductCategory/DeleteCategory", {
        params: { categoryId: id },
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
      .get("/ProductCategory/GetAllCategories")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          const formattedArray = [];
          res.data.categoryViewModelList?.map((role, index) => {
            formattedArray.push({
              ...role,
              key: role?.productCategoryId,
              index: role?.productCategoryId,
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
      setPageRoutes([{ label: "محصولات" }, { label: "لیست دسته بندی محصولات" }])
    );

    handleGetList();
  }, []);

  return (
    <>
      <div className="w-full min-h-pagesHeight p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>دسته بندی ها</h1>

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
            ساخت دسته بندی جدید
          </Button>
        </div>

        {/* content */}
        <div className="w-full py-5 overflow-x-auto">
          {!loading ? (
            <Tree
              treeData={pageList}
              fieldNames={{
                title: "categoryName",
                value: "productCategoryId",
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
