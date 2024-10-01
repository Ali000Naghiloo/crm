import { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../hooks/useHttps";
import { Button, Popconfirm, Table, Tag } from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
// import CreateCondition from "./create factor/CreateCondition";
// import ConditionModal from "./condition data/ConditionData";
import { setPageRoutes } from "../../store/reducers/pageRoutes";
import PageRoutes from "../../common/PageRoutes";
import Loading from "../../common/Loading";

export default function Conditions() {
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
  const CreateCondition = lazy(() => import("./CreateCondition"));
  const ConditionModal = lazy(() => import("./condition data/ConditionData"));

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "نوع",
      dataIndex: "additionsAndDeductionsType",
      render: (value) => <>{allEnum?.AdditionsAndDeductionsType[value]}</>,
      key: "additionsAndDeductionsType",
    },
    {
      title: "عنوان",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "کد",
      dataIndex: "code",
      sorter: (a, b) => a.code - b.code,
      key: "code",
    },
    {
      title: "نمایش در پرینت فاکتور",
      dataIndex: "displayInFactorPrinting",
      render: (value) => <>{allEnum?.DisplayInFactorPrinting[value]}</>,
      key: "displayInFactorPrinting",
    },
    {
      title: "نمایش در فاکتور",
      dataIndex: "displayInTheFactor",
      render: (value) => <>{allEnum?.DisplayInTheFactor[value]}</>,
      key: "displayInTheFactor",
    },
    {
      title: "نحوه نمایش در فاکتور",
      dataIndex: "procedureForApplyingOnFactor",
      render: (value) => <>{allEnum?.ProcedureForApplyingOnFactor[value]}</>,
      key: "procedureForApplyingOnFactor",
    },
    {
      title: "مسئولین فاکتور",
      dataIndex: "additionsAndDeductionsBannedUsers",
      width: "250px",
      render: (value) => {
        return (
          <>
            {value && value?.length !== 0 ? (
              value?.length < 5 ? (
                <div className="w-full flex justify-start gap-1 flex-wrap">
                  {value?.map((cu, index) => {
                    return (
                      <Tag key={index} color="blue" className="m-0">
                        {cu.user}
                      </Tag>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full flex justify-start gap-1 flex-wrap">
                  {value?.map((cu, index) => {
                    if (index < 5) {
                      return (
                        <Tag key={index} color="blue" className="m-0">
                          {cu.user}
                        </Tag>
                      );
                    }
                  })}
                  <Tag color="blue-inverse">... +</Tag>
                </div>
              )
            ) : (
              <div className="">-</div>
            )}
          </>
        );
      },
      key: "additionsAndDeductionsBannedUsers",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-1">
          <Button
            onClick={() =>
              setDataModal({
                data: data,
                open: true,
                id: data?.additionsAndDeductionsId,
              })
            }
            size="middle"
            type="primary"
          >
            مشاهده
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این فاکتور اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.additionsAndDeductionsId)}
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
      .get("/AdditionsAndDeductions/DeleteAdditionsAndDeduction", {
        params: { additionsAndDeductionId: id },
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
      .get("/AdditionsAndDeductions/AdditionsAndDeductions")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.additionsAndDeductionsViewModelList.map((data, index) => {
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
        { label: "اضافات کسورات" },
        { label: "فهرست اضافه کسری ها" },
      ])
    );

    handleGetList();
  }, []);

  return (
    <Suspense>
      <div className="w-full min-h-pagesHeight p-2 md:p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>اضافات و کسورات</h1>

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
            ساخت اضافه کسری جدید
          </Button>
        </div>

        {/* content */}
        <div className="max-w-[100%] py-5 overflow-x-auto">
          <Table
            size="small"
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

      <ConditionModal
        open={dataModal.open}
        setOpen={(e) => {
          setDataModal({
            ...dataModal,
            open: e?.target?.value,
          });
        }}
        data={dataModal.data}
        id={dataModal.id}
        list={pageList}
        getNewList={handleGetList}
      />

      <CreateCondition
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
