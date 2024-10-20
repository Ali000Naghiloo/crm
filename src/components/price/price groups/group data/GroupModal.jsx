import { Button, Modal, Tabs } from "antd";
import DataTab from "./DataTab";
import MethodTab from "./MethodTab";
import useHttp from "../../../../hooks/useHttps";
import { useEffect, useState } from "react";

export default function CustomerModal({ open, setOpen, id, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleGetGroupData = async () => {
    setLoading(true);

    await httpService
      .get("/PricingMethodGroup/PricingMethodGroupDetail", {
        params: { pricingMethodGroupId: id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          setData(res.data?.pricingMethodGroupDetailViewModel);
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
    if (tabName === "method") {
      return <MethodTab data={data} handleClose={handleClose} />;
    }
  };

  const customerTabs = [
    {
      key: "data",
      label: "اطلاعات گروه",
      children: handleRenderTabContent("data", data),
    },
    {
      key: "method",
      label: "شروط قیمت گذاری",
      children: handleRenderTabContent("method", data),
    },
  ];

  useEffect(() => {
    if (open) handleGetGroupData();
  }, [id]);

  if (id)
    return (
      <>
        <Modal
          loading={loading}
          className="!w-fit md:!min-w-[600px]"
          open={open}
          onCancel={handleClose}
          title={
            data && `گروه : "${data ? data?.pricingMethodGroupTitle : ""}"`
          }
          footer={
            <Button onClick={handleClose} type="primary">
              بستن
            </Button>
          }
        >
          <Tabs
            // defaultActiveKey="phone"
            className="pt-5"
            centered
            items={customerTabs}
            indicator={{ size: (origin) => origin - 20 }}
          />
        </Modal>
      </>
    );
}
