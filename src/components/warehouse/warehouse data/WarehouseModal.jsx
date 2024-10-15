import { Button, Modal, Tabs } from "antd";
import DataTab from "./DataTab";
import AddressTab from "./AddressTab";
import PhoneTab from "./PhoneTab";
import NoteTab from "./NoteTab";
import AttachmentTab from "./AttachmentTab";
import ManagerTab from "./ManagerTab";
import ProductTab from "./ProductTab";
import TransactionTab from "./TransactionTab";
import useHttp from "../../../hooks/useHttps";
import { useEffect, useState } from "react";

export default function CustomerModal({ open, setOpen, id, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const handleGetWarehouseData = async () => {
    await httpService
      .get("/Warehouse/GetWarehouseDetail", {
        params: { warehouseId: id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          setData(res.data?.warehouseDetailViewModel);
        }
      });

    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setData(null);
  };

  const handleRenderTabContent = (tabName, data) => {
    if (tabName === "data") {
      return (
        <DataTab
          data={data}
          getNewList={getNewList}
          handleClose={handleClose}
        />
      );
    }
    if (tabName === "address") {
      return <AddressTab data={data} />;
    }
    if (tabName === "phone") {
      return <PhoneTab data={data} />;
    }
    if (tabName === "note") {
      return <NoteTab data={data} />;
    }
    if (tabName === "manager") {
      return <ManagerTab data={data} />;
    }
    if (tabName === "product") {
      return <ProductTab data={data} />;
    }
    if (tabName === "transaction") {
      return <TransactionTab data={data} />;
    }
    if (tabName === "upload") {
      return (
        <AttachmentTab
          data={data}
          getNewList={getNewList}
          handleClose={handleClose}
        />
      );
    }
  };

  const warehouseTabs = [
    {
      key: "data",
      label: "اطلاعات انبار",
      children: handleRenderTabContent("data", data),
    },
    {
      key: "address",
      label: "آدرس  (ها)",
      children: handleRenderTabContent("address", data),
    },
    {
      key: "phone",
      label: "شماره تلفن (ها)",
      children: handleRenderTabContent("phone", data),
    },
    {
      key: "note",
      label: "یادداشت",
      children: handleRenderTabContent("note", data),
    },
    {
      key: "manager",
      label: "مدیران",
      children: handleRenderTabContent("manager", data),
    },
    {
      key: "product",
      label: "کالا و خدمات  (ها)",
      children: handleRenderTabContent("product", data),
    },
    {
      key: "transaction",
      label: "تراکنش  (ها)",
      children: handleRenderTabContent("transaction", data),
    },
    {
      key: "upload",
      label: "بارگذاری",
      children: handleRenderTabContent("upload", data),
    },
  ];

  useEffect(() => {
    if (open) handleGetWarehouseData();
  }, [id]);

  if (id)
    return (
      <>
        <Modal
          loading={loading}
          className="md:!w-fit md:min-w-[700px] max-w-[1000px]"
          open={open}
          onCancel={handleClose}
          title={data && `انبار : "${data?.warehouseName}"`}
          footer={
            <Button onClick={handleClose} type="primary">
              بستن
            </Button>
          }
        >
          <Tabs
            // defaultActiveKey="phone"
            className="pt-5"
            items={warehouseTabs}
          />
        </Modal>
      </>
    );
}
