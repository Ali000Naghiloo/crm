import { Button, ColorPicker, Input, Popconfirm, Table } from "antd";
import useHttp from "../../../../../../hooks/useHttps";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";
import ConditionModal from "./ConditionModal";

export default function ConditionTab({ data, pricingMethodId }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({
    open: false,
    data: null,
    mode: null,
  });
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
      title: "نام شرط",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() =>
              setModalData({ data: data, open: true, mode: "edit" })
            }
          >
            <FaPen />
          </Button>
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این شرط اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.pricingMethodConditionId)}
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
      pricingMethodId: pricingMethodId,
    };

    await httpService
      .get("/PricingMethodCondition/PricingMethodConditions", {
        params: formData,
      })
      .then((res) => {
        if (res.status == 200 && res.data?.code === 1) {
          res.data.pricingMethodConditionViewModelList.map((data, index) => {
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
      .get("/PricingMethodCondition/DeletePricingMethodCondition", {
        params: { pricingMethodConditionId: id },
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
      data?.pricingMethodConditions?.map((data, index) => {
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
          <h1 className="text-lg">فهرست شرط های این روش</h1>

          <div className="flex items-center justify-center pl-5">
            <Button className="p-1" type="text" onClick={getNewList}>
              <HiRefresh size={"2em"} />
            </Button>
          </div>
        </div>

        <div className="w-full">
          <Button
            onClick={() => {
              setModalData({
                open: !modalData.open,
                data: null,
                mode: "create",
              });
            }}
            className="w-full"
            size="middle"
            type="primary"
          >
            ثبت شرط جدید برای این روش
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

      <ConditionModal
        data={modalData.data}
        getNewList={getNewList}
        mode={modalData.mode}
        open={modalData.open}
        setOpen={(e) => {
          setModalData({ open: e });
        }}
        pricingMethodId={pricingMethodId}
      />
    </>
  );
}
