import { Button, Popconfirm, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../../hooks/useHttps";
import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { toast } from "react-toastify";
import PhoneModal from "./create-edit/PhoneModal";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { handleCopy } from "../../../hooks/functions";

export default function PhoneTab({ data }) {
  const dispatch = useDispatch();
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
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "نوع خط",
      dataIndex: "mobileOrLandline",
      render: (value) => <span>{allEnum?.MobileOrLandline[value]}</span>,
      key: "mobileOrLandline",
    },
    {
      title: "شماره",
      dataIndex: "phoneNumber",
      render: (value) => (
        <div className="flex items-center">
          <Button
            size="small"
            className="p-1"
            onClick={() => handleCopy(value)}
          >
            <BiCopy />
          </Button>
          <span>{value}</span>
        </div>
      ),
      key: "phoneNumber",
    },
    {
      title: "کد کشور",
      dataIndex: "countryCode",
      key: "countryCode",
    },
    {
      title: "کد شهر",
      dataIndex: "cityCode",
      key: "cityCode",
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
            title="آیا از حذف این شماره اطمینان دارید؟"
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
      .post("/Phone/Phones", formData)
      .then((res) => {
        if (res.status == 200 && res.data?.code === 1) {
          res.data.phoneViewModelsList.map((data, index) => {
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
      .get("/Phone/DeletePhone", { params: { phoneId: id } })
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
        <div className="text-lg">
          <h2>فهرست شماره تلفن های شخص</h2>
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
            ثبت شماره تلفن جدید برای این شخص
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

      <PhoneModal
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
