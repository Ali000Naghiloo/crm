import { Button, Popconfirm, Select, Table } from "antd";
import useHttp from "../../../hooks/useHttps";
import { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import { HiRefresh } from "react-icons/hi";

export default function UnitTab({ data }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [productUnits, setProuctUnits] = useState([]);
  const [showModal, setShowModal] = useState({
    open: false,
    data: null,
    id: null,
  });

  const UnitModal = lazy(() => import("./create-edit/UnitModal"));

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "واحد",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "تعداد در واحد",
      dataIndex: "quantityInUnit",
      key: "quantityInUnit",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              setShowModal({ id: data?.unitId, open: true, data: data });
            }}
          >
            <MdEdit />
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این واحد اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.unitId)}
          >
            <Button size="middle" type="primary" danger>
              <MdDelete />
            </Button>
          </Popconfirm>
        </div>
      ),
      key: "customerType",
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPerPage(pagination.pageSize);
  };

  const getNewList = async () => {
    setLoading(true);
    const formData = {
      productId: data?.productId,
    };

    await httpService
      .get("/ProductUnit/ProductUnit", { params: formData })
      .then((res) => {
        if (res.status == 200 && res.data?.code === 1) {
          res.data.productUnitViewModelList[0]
            ? setPageList(res.data.productUnitViewModelList[0])
            : null;
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const formData = {
      productId: data?.productId,
      unitId: id,
    };

    await httpService
      .get("/ProductUnit/DeleteProductUnit", {
        params: formData,
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1)
          toast.success("با موفقیت حذف شد");
      })
      .catch(() => {});

    getNewList();
    setLoading(false);
  };

  useEffect(() => {
    let datas = [];

    if (data) {
      data?.productWeightViewModelList?.map((data, index) => {
        datas.push({ ...data, index: index + 1 });
      });

      getNewList();
      setPageList(datas);
    }
  }, [data]);

  return (
    <Suspense>
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <Button
            className="w-full"
            type="primary"
            onClick={() => {
              setShowModal({
                open: true,
                data: null,
                id: null,
              });
            }}
          >
            تغییر واحد برای این کالا و خدمات
          </Button>
        </div>

        <div className="w-full flex flex-col gap-1">
          <div className="w-full overflow-x-auto">
            {/* <Table
            size="small"
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

            <div className="w-full h-fit flex flex-col items-center justify-center gap-5 font-bold text-xl my-10">
              <span>
                واحد فعلی کالا :{" "}
                {pageList?.unit?.unitName ? pageList?.unit.unitName : "-"}
              </span>
              <span>
                مقدار در واحد :{" "}
                {pageList?.quantityInUnit ? pageList?.quantityInUnit : "-"}
              </span>
            </div>
          </div>
        </div>

        <UnitModal
          open={showModal.open}
          setOpen={(e) => {
            setShowModal({ open: e });
          }}
          data={showModal.data}
          productId={data?.productId}
          getNewList={getNewList}
        />
      </div>
    </Suspense>
  );
}
