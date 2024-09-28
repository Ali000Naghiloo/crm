import { Button, Popconfirm, Select, Table } from "antd";
import useHttp from "../../../hooks/useHttps";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";

export default function RoleTab({ data }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [allRoles, setAllRoles] = useState(null);
  const [customerRoles, setCustomerRoles] = useState(null);
  const [customerRolesList, setCustomerRolesList] = useState(null);
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
      title: "نام نقش",
      dataIndex: "customerRole",
      key: "customerRole",
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
            title="آیا از حذف این نقش اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => {
              handleChangeCustomerRoles(
                customerRoles.filter((r) => r !== data?.customerRoleId)
              );
            }}
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

  const getAllRoles = async () => {
    setLoading(true);
    let datas = [];
    const formData = {
      id: data?.customerId,
      customerOrConnectorType: data?.customerType,
    };

    await httpService
      .get("/CustomerRole/GetAllCustomerRoles", formData)
      .then((res) => {
        if (res.status == 200 && res.data?.code === 1) {
          res.data.customerRoleList.map((data) => {
            datas.push({ label: data?.roleName, value: data?.customerRoleId });
          });
        }
      })
      .catch(() => {});

    setAllRoles(datas);
    setLoading(false);
  };

  const getCustomerRoles = async () => {
    setLoading(true);
    let datas = [];
    let datasList = [];
    const formData = {
      customerId: data?.customerId,
    };

    await httpService
      .get("/Customer/GetCustomerDetail", { params: formData })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.roleMappings?.length !== 0
            ? res.data.customerViewModel.roleMappings.map((data, index) => {
                datas.push(data?.customerRoleId);
                datasList.push({
                  ...data,
                  index: index + 1,
                });
              })
            : null;
        }
      })
      .catch(() => {});

    setCustomerRolesList(datasList);
    setCustomerRoles(datas);
    setLoading(false);
  };

  const handleChangeCustomerRoles = async (values) => {
    setLoading(true);

    let roleMappings = [];
    values && values?.length
      ? values.map((role) => {
          roleMappings.push({
            customerRoleId: role,
          });
        })
      : null;
    const formData = {
      customerId: data?.customerId,
      roleMappings: roleMappings,
    };

    await httpService
      .post("/Customer/EditCustomerRole", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          getCustomerRoles();
        }
      })
      .catch(() => {
        toast.error("تغییرات نقش شخص با خطا مواجه شد");
      });

    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);

    await httpService
      .get("/CustomerRole/DeleteCustomerRole", { params: { phoneId: id } })
      .then((res) => {
        toast.success("با موفقیت حذف شد");
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    let datas = [];
    let datasList = [];

    if (data) {
      data?.roleMappings?.map((data, index) => {
        datas.push(data?.customerRoleId);
        datasList.push({ ...data, index: index + 1 });
      });

      setCustomerRolesList(datasList);
      setCustomerRoles(datas);
    }

    getAllRoles();
    // getCustomerRoles();
  }, [data]);

  useEffect(() => {
    console.log(customerRoles);
  }, [customerRoles]);

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="text-lg">
          <h2>لیست نقش های شخص</h2>
        </div>

        <div className="w-full">
          <span>لیست نقش های در دسترس (برای اضافه کردن کلیک کنید)</span>
          <Select
            optionFilterProp="label"
            allowClear
            loading={loading}
            disabled={loading}
            options={allRoles}
            value={customerRoles}
            onChange={(e) => {
              handleChangeCustomerRoles(e);
            }}
            className="w-full"
            mode="multiple"
            placeholder="نقش ها را انتخاب کنید..."
          />
        </div>

        <div className="w-full overflow-x-auto">
          <Table
            loading={loading}
            columns={columns}
            dataSource={customerRolesList}
            pagination={{
              position: ["bottomRight"],
              current: currentPage,
              pageSize: perPage,
              total: customerRoles ? customerRoles.length : 0,
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
