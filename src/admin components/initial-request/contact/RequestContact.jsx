import { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../../hooks/useHttps";
import { Button, Popconfirm, Table, Tag } from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
import { setPageRoutes } from "../../../store/reducers/pageRoutes";
import PageRoutes from "../../../common/PageRoutes";
import { useNavigate } from "react-router-dom";
import formatHelper from "../../../helper/formatHelper";

export default function RequestContact({ pageType }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showModal, setShowModal] = useState({
    open: false,
    id: null,
    data: null,
  });
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  // imports
  const CreateRequestContact = lazy(() => import("./RequestContactModal"));

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "عنوان",
      dataIndex: "name",
      sorter: (a, b) => a.name - b.name,
      key: "name",
    },
    {
      title: "کد درخواست",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setShowModal({ data: data, open: true });
            }}
            size="middle"
            type="primary"
          >
            ویرایش
          </Button>
          <Popconfirm
            cancelText="خیر"
            okText="بله"
            title="آیا از حذف این فاکتور اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.id)}
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
      .get("/InitialRequest/DeleteInitialRequest", {
        params: { initialRequestId: id },
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
      .get("/InitialRequest/GetAllInitialRequest")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.initialRequestViewModelList.map((data, index) => {
            datas.push({ ...data, index: index + 1, key: data?.id });
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
        { label: "درخواست ها" },
        { label: "فهرست درخواست تماس اولیه" },
      ])
    );

    handleGetList();
  }, []);

  return (
    <Suspense>
      <div className="w-full h-full p-2 md:p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>درخواست های تماس اولیه</h1>

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
            onClick={() =>
              setShowModal({
                open: true,
                id: null,
              })
            }
          >
            {"درخواست تماس اولیه"} جدید
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

      <CreateRequestContact
        open={showModal.open}
        setOpen={(e) => {
          setShowModal({ open: e });
        }}
        data={showModal.data}
        getNewList={handleGetList}
      />
    </Suspense>
  );
}
