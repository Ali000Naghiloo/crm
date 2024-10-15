import { Button, ColorPicker, Popconfirm, Table } from "antd";
import useHttp from "../../../hooks/useHttps";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import SizeModal from "./create-edit/SizeModal";
import { HiRefresh } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function SizeTab({ data }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showModal, setShowModal] = useState({
    open: false,
    mode: "",
    data: null,
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
      title: "نام اندازه",
      dataIndex: "sizeName",
      key: "sizeName",
    },
    {
      title: "تعداد",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "طول",
      dataIndex: "width",
      key: "width",
    },
    {
      title: "عرض",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "واحد",
      dataIndex: "sizeUnit",
      render: (value) => <div>{allEnum?.SizeUnit[value]}</div>,
      key: "sizeUnit",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این اندازه اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.colorId)}
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
      .get("/ProductSize/ProductSizes", {
        params: { productId: data?.productId },
      })
      .then((res) => {
        if (res.status == 200 && res.data?.code === 1) {
          res.data.productSizeViewModelList.map((data, index) => {
            datas.push({ ...data, index: index + 1 });
          });
        }
      })
      .catch(() => {});

    setPageList(datas);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);

    await httpService
      .get("/ProductColor/DeleteProductColor", {
        params: { productColorId: id },
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
      data?.phones?.map((data, index) => {
        datas.push({ ...data, index: index + 1 });
      });

      getNewList();
      setPageList(datas);
    }
  }, [data]);

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex justify-between py-5 font-bold">
          <h1 className="text-lg">فهرست اندازه های این کالا و خدمات</h1>

          <div className="flex items-center justify-center pl-5">
            <Button className="p-1" type="text" onClick={getNewList}>
              <HiRefresh size={"2em"} />
            </Button>
          </div>
        </div>

        <div className="w-full">
          <Button
            onClick={() => {
              setShowModal({
                mode: "create",
                open: true,
                data: data,
                id: data?.productId,
              });
            }}
            className="w-full"
            size="middle"
            type="primary"
          >
            ثبت اندازه جدید برای این کالا و خدمات
          </Button>
        </div>

        <div className="w-full overflow-x-auto">
          <Table
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
          />
        </div>
      </div>

      <SizeModal
        open={showModal.open}
        setOpen={(e) => {
          setShowModal({ open: e });
        }}
        mode={showModal.mode}
        data={showModal.data}
        productId={showModal.id}
        getNewList={getNewList}
      />
    </>
  );
}
