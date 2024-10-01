import { Button, Popconfirm, Table } from "antd";
import useHttp from "../../../hooks/useHttps";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import AddressModal from "./create-edit/AddressModal";

export default function AddressTab({ data }) {
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
      title: "نام آدرس",
      dataIndex: "addressName",
      key: "addressName",
    },
    {
      title: "مکان",
      render: (data) => (
        <div className="flex">
          <span>{data?.country}</span>,<span>{data?.province}</span>,
          <span>{data?.city}</span>
        </div>
      ),
      key: "place",
    },
    {
      title: "کد پستی",
      dataIndex: "postalCode",
      key: "place",
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
            title="آیا از حذف این یادداشت اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.id)}
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
    const formData = {
      id: data?.customerId,
      customerOrConnectorType: data?.customerType,
    };

    await httpService
      .post("/Address/Address", formData)
      .then((res) => {
        if (res.status == 200 && res.data?.code === 1) {
          res.data.addressViewModelList.map((data, index) => {
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
      .get("/Address/Address", { params: { addressId: id } })
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
      data?.addresses?.map((data, index) => {
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
          <h2>فهرست آدرس های شخص</h2>
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
            ثبت آدرس جدید برای این شخص
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

      <AddressModal
        open={showModal.open}
        setOpen={(e) => {
          setShowModal({ open: e });
        }}
        mode={showModal.mode}
        data={showModal.data}
        customerId={data?.customerId}
        getNewList={getNewList}
      />
    </>
  );
}
