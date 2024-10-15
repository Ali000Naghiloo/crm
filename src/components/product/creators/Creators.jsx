import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageRoutes from "../../../common/PageRoutes";
import { setPageRoutes } from "../../../store/reducers/pageRoutes";
import useHttp, { baseURL } from "../../../hooks/useHttps";
import { Button, Popconfirm, Table, Tag } from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
import CreateGroup from "./CreateCreator";
import UpdateGroup from "./UpdateCreator";

export default function Creators() {
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
  const allEnum = useSelector((state) => state.allEnum.allEnum);

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
          {datas?.name} {datas?.latinName ? `(${datas?.latinName})` : ""}
        </div>
      ),
      key: "name",
    },
    {
      title: "نوع نقش",
      dataIndex: "productManufacturerCode",
      key: "productManufacturerCode",
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
            title="آیا از حذف این شخص اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.productManufacturerId)}
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
      .get("/Manufacturer/DeleteManufacturer", {
        params: { productManufacturerId: id },
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
      .get("/Manufacturer/Manufacturers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.productManufacturerViewModelList.map((data, index) => {
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
        { label: "کالا و خدماتات" },
        { label: "فهرست تامین کنندگان کالا و خدمات" },
      ])
    );

    handleGetList();
  }, []);

  return (
    <>
      <div className="w-full min-h-pagesHeight p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>سازندگان</h1>

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
            ساخت سازنده جدید
          </Button>
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
            expandable={{
              expandedRowRender: (record) => (
                <div className="flex flex-col">
                  <p>توضیحات : </p>
                  <p>{record?.description}</p>
                </div>
              ),
            }}
          />
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
