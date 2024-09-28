import { Button, Modal, Tabs } from "antd";
import { useEffect, useState } from "react";
import DataTab from "./DataTab";
import ConnectorTab from "./ConnectorTab";
import PhoneTab from "./PhoneTab";
import AddressTab from "./AddressTab";
import RoleTab from "./RoleTab";
import NoteTab from "./NoteTab";
import useHttp from "../../../hooks/useHttps";
import AttachmentTab from "./AttachmentTab";
import FactorTab from "./FactorTab";

export default function CustomerModal({ open, setOpen, id, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const handleGetCustomerData = async () => {
    await httpService
      .get("/Customer/GetCustomerDetail", {
        params: { customerId: id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          setData(res.data?.customerViewModel);
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
    if (tabName === "connector") {
      return <ConnectorTab data={data} />;
    }
    if (tabName === "phone") {
      return <PhoneTab data={data} />;
    }
    if (tabName === "address") {
      return <AddressTab data={data} />;
    }
    if (tabName === "role") {
      return <RoleTab data={data} />;
    }
    if (tabName === "note") {
      return <NoteTab data={data} />;
    }
    if (tabName === "upload") {
      return <AttachmentTab data={data} getNewList={handleGetCustomerData} />;
    }
    if (tabName === "factor") {
      return <FactorTab data={data} />;
    }
  };

  const customerTabs = [
    {
      key: "data",
      label: "اطلاعات شخص",
      children: handleRenderTabContent("data", data),
    },
    {
      key: "connector",
      label: "رابط (ها)",
      children: handleRenderTabContent("connector", data),
    },
    {
      key: "phone",
      label: "شماره تلفن (ها)",
      children: handleRenderTabContent("phone", data),
    },
    {
      key: "address",
      label: "آدرس  (ها)",
      children: handleRenderTabContent("address", data),
    },
    {
      key: "role",
      label: "نقش  (ها)",
      children: handleRenderTabContent("role", data),
    },
    {
      key: "note",
      label: "یادداشت",
      children: handleRenderTabContent("note", data),
    },
    {
      key: "upload",
      label: "بارگذاری",
      children: handleRenderTabContent("upload", data),
    },
    {
      key: "factor",
      label: "فاکتور",
      children: handleRenderTabContent("factor", data),
    },
  ];

  useEffect(() => {
    if (open) handleGetCustomerData();
  }, [id, open]);

  if (id)
    return (
      <>
        <Modal
          loading={loading}
          className="md:!w-fit md:min-w-[700px] max-w-[1000px]"
          open={open}
          onCancel={handleClose}
          title={data && `شخص : "${data?.customerName}"`}
          footer={
            <Button onClick={handleClose} type="primary">
              بستن
            </Button>
          }
        >
          <Tabs defaultActiveKey="data" className="pt-5" items={customerTabs} />
        </Modal>
      </>
    );
}
