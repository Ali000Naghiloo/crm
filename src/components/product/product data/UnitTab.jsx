import { Button, Popconfirm, Select, Table } from "antd";
import useHttp from "../../../hooks/useHttps";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import WeightModal from "./create-edit/WeightModal";
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
    mode: "",
    data: null,
    id: null,
  });

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "واحد",
      dataIndex: "unitName",
      key: "unitName",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Popconfirm
            cancelText="لغو"
            okText="حذف"
            title="آیا از حذف این وزن اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.weightId)}
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
      .get("/Unit/Units", {})
      .then((res) => {
        if (res.status == 200 && res.data?.code === 1) {
          res.data.unitViewModelList.map((data, index) => {
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
      .get("/ProductWeight/DeleteProductWeight", {
        params: { productWeightId: id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1)
          toast.success("با موفقیت حذف شد");
      })
      .catch(() => {});

    getNewList();
    setLoading(false);
  };

  const handleAddUnitToProduct = async (e) => {
    setLoading(true);

    await httpService
      .post("")
      .then((res) => {})
      .catch(() => {});

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
    <div className="flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <span>فهرست واحد ها</span>
        <Select
          mode="multiple"
          options={pageList?.map((un) => {
            return { label: un?.unitName, value: un?.unitId };
          })}
          value={productUnits}
          onChange={(e) => {
            handleAddUnitToProduct(e);
          }}
          className="w-[100%]"
          placeholder="لطفا اینجا وارد کنید..."
        />
      </div>

      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex justify-between font-bold">
          <h1 className="text-lg">فهرست واحد های این کالا و خدمات</h1>

          <div className="flex items-center justify-center pl-5">
            <Button className="p-1" type="text" onClick={getNewList}>
              <HiRefresh size={"2em"} />
            </Button>
          </div>
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

      <WeightModal
        open={showModal.open}
        setOpen={(e) => {
          setShowModal({ open: e });
        }}
        mode={showModal.mode}
        data={showModal.data}
        productId={showModal.id}
        getNewList={getNewList}
      />
    </div>
  );
}
