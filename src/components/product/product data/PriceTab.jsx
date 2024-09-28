import { Button, Popconfirm, Table } from "antd";
import useHttp from "../../../hooks/useHttps";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import PriceModal from "./create-edit/PriceModal";
import formatHelper from "../../../helper/formatHelper";

export default function ConnectorTab({ data }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showModal, setShowModal] = useState({
    open: false,
    mode: "",
    data: null,
  });
  // const allEnum = useSelector((state) => state.allEnum.allEnum);

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "نام قیمت",
      dataIndex: "productPrice",
      key: "productPrice",
    },
    {
      title: "واحد",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "قیمت",
      dataIndex: "price",
      render: (value) => <div>{formatHelper.numberSeperator(value)}</div>,
      key: "price",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              setShowModal({
                data: data,
                open: true,
                mode: "edit",
              })
            }
            size="middle"
            type="primary"
          >
            <FaPen />
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این قیمت اطمینان دارید؟"
            placement="topRight"
            onConfirm={() =>
              handleDelete({
                productId: data?.productId,
                unitId: data?.unitId,
                productPriceId: data?.productPriceId,
              })
            }
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
    let datas = [];

    await httpService
      .get("/ProductUnitPrice/ProductUnitPrices", {
        params: { productId: data?.productId },
      })
      .then((res) => {
        if (res.status == 200 && res.data?.code === 1) {
          res.data.productUnitPriceViewModelList.map((data, index) => {
            datas.push({ ...data, index: index + 1 });
          });
        }
      })
      .catch(() => {});

    setPageList(datas);
    setLoading(false);
  };

  const handleDelete = async (datas) => {
    setLoading(true);
    let data = {
      productId: datas?.productId,
      unitId: datas?.unitId,
      productPriceId: datas?.productPriceId,
    };

    await httpService
      .get("/ProductUnitPrice/DeleteProductUnitPrice", {
        params: data,
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
      data?.connectors?.map((data, index) => {
        datas.push({ ...data, index: index + 1 });
      });

      getNewList();
      setPageList(datas);
    }
  }, [data]);

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="text-lg">
          <h2>لیست قیمت های محصول</h2>
        </div>

        <div className="w-full">
          <Button
            onClick={() => {
              setShowModal({
                mode: "create",
                open: true,
                data: data,
              });
            }}
            className="w-full"
            size="middle"
            type="primary"
          >
            ثبت قیمت جدید برای این محصول
          </Button>
        </div>

        <div className="w-full overflow-x-auto">
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

      <PriceModal
        open={showModal.open}
        setOpen={(e) => {
          setShowModal({ open: e });
        }}
        mode={showModal.mode}
        data={showModal.data}
        productId={data?.productId}
        getNewList={getNewList}
      />
    </>
  );
}
