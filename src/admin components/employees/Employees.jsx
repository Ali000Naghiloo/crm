import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PageRoutes from "../../common/PageRoutes";
import { setPageRoutes } from "../../store/reducers/pageRoutes";
import useHttp, { imageUrl } from "../../hooks/useHttps";
import { Avatar, Button, Table } from "antd";
import { BiCopy } from "react-icons/bi";
import { handleCopy } from "../../hooks/functions";
import { FaUser } from "react-icons/fa";

export default function Employees() {
  const dispatch = useDispatch();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // const allEnum = useSelector((state) => state.allEnum.allEnum);

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "پروفایل",
      dataIndex: "imagePath",
      render: (img) => {
        if (img === imageUrl) {
          return (
            <div className="">
              <Avatar icon={<FaUser />} />
            </div>
          );
        } else {
          return (
            <div className="w-10 h-10 rounded-full">
              <img
                className="w-full h-full rounded-full"
                src={img}
                alt="تصویر"
              />
            </div>
          );
        }
      },
      key: "imagePath",
    },
    {
      title: "نام کارمند",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "نام کاربری",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "نوع شخص",
      dataIndex: "phoneNumber",
      render: (value) => (
        <div className="flex">
          <span>{value}</span>{" "}
          <Button
            className="p-1"
            size="small"
            onClick={() => handleCopy(value)}
          >
            <BiCopy />
          </Button>
        </div>
      ),
      key: "phoneNumber",
    },

    {
      title: "ایمیل",
      dataIndex: "email",
      render: (value) => <div>{value}</div>,
      key: "email",
    },
    {
      title: "دسترسی ادمین؟",
      dataIndex: "isActive",
      render: (value) => {
        return (
          <>
            {value === 1 ? (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            ) : (
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            )}
          </>
        );
      },
      key: "customerType",
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPerPage(pagination.pageSize);
  };

  const handleGetCustomers = async () => {
    setLoading(true);

    await httpService
      .get("/Account/GetAllUsers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.data.map((data, index) => {
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
      setPageRoutes([{ label: "کارمندان" }, { label: "فهرست کارمندان" }])
    );

    handleGetCustomers();

    if (document) document.title = "کارمندان";
  }, []);

  return (
    <>
      <div className="w-full h-full p-5">
        {/* page title */}
        <div className="w-full text-4xl py-5 font-bold">
          <h1>کارمندان</h1>
        </div>

        {/* routes */}
        <div>
          <PageRoutes />
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
          />
        </div>
      </div>
    </>
  );
}
