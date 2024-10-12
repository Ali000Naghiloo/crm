import { Button, Dropdown, Popconfirm, Popover, Table, Tag } from "antd";
import useHttp from "../../../hooks/useHttps";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { convertISOToDate } from "../../../hooks/functions";
import formatHelper from "../../../helper/formatHelper";
import CreateFactorModal from "../../factor/create factor/CreateFactor";
import { useWindowSize } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

export default function NoteTab({ data }) {
  const size = useWindowSize();
  const navigate = useNavigate();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "شماره فاکتور",
      dataIndex: "factorNumber",
      sorter: (a, b) => a.factorNumber - b.factorNumber,
      key: "factorNumber",
    },
    {
      title: "نوع",
      dataIndex: "factorType",
      render: (value) => <div>{value ? allEnum?.FactorType[value] : "-"}</div>,
      key: "factorType",
    },
    {
      title: "تاریخ",
      dataIndex: "factorDate",
      render: (value) => <div>{value ? convertISOToDate(value) : "-"}</div>,
      key: "factorDate",
    },
    {
      title: "مبلغ کل",
      dataIndex: "totalFactorPrice",
      render: (value) => (
        <div>{value ? formatHelper.numberSeperator(value) : "0"}</div>
      ),
      key: "totalFactorPrice",
    },
    {
      title: "مسئول (ها)",
      dataIndex: "factorResponsibles",
      render: (value) => (
        <div>
          {value && value?.length !== 0
            ? value?.map((pr, index) => (
                <Popover content={pr?.assignedDate} title="تاریخ" key={index}>
                  <Tag>{pr?.user}</Tag>
                </Popover>
              ))
            : "-"}
        </div>
      ),
      key: "factorResponsibles",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              navigate("/factors/create", {
                data: data,
                factorId: data?.factorId,
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
            title="آیا از حذف این فاکتور اطمینان دارید؟"
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

    await httpService
      .get("/Factor/GetAllCustomerFactors", {
        params: { customerId: data?.customerId },
      })
      .then((res) => {
        if (res.status == 200 && res.data?.code === 1) {
          res.data.factorViewModelList.map((data, index) => {
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
      .get("/Factor/DeleteFactor", { params: { factorId: id } })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1)
          toast.success("با موفقیت حذف شد");
      })
      .catch(() => {});

    getNewList();
    setLoading(false);
  };

  useEffect(() => {
    getNewList();
  }, [data]);

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="text-lg">
          <h2>فهرست فاکتور های شخص</h2>
        </div>

        <div className="w-full flex gap-3 flex-wrap">
          <Button
            onClick={() => {
              navigate("/factors/create", {
                state: {
                  data: data,
                  type: 0,
                },
              });
            }}
            className="min-w-[300px] mx-auto"
            size="middle"
            type="primary"
          >
            ثبت درخواست کالا
          </Button>{" "}
          <Button
            onClick={() => {
              navigate("/factors/create", {
                state: {
                  data: data,
                  type: 2,
                  customerId: data?.customerId,
                },
              });
            }}
            className="min-w-[300px] mx-auto"
            size="middle"
            type="primary"
          >
            ثبت پیش فاکتور
          </Button>
          <Button
            onClick={() => {
              navigate("/factors/create", {
                state: {
                  data: data,
                  type: 3,
                  customerId: data?.customerId,
                },
              });
            }}
            className="min-w-[300px] mx-auto"
            size="middle"
            type="primary"
          >
            ثبت فاکتور فروش
          </Button>
          <Button
            onClick={() => {
              navigate("/factors/create", {
                state: {
                  data: data,
                  type: 4,
                  customerId: data?.customerId,
                },
              });
            }}
            className="min-w-[300px] mx-auto"
            size="middle"
            type="primary"
          >
            ثبت فاکتور برگشت از فروش
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
    </>
  );
}
