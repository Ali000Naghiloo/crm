import { Button, Modal, Tabs } from "antd";
import DataTab from "./DataTab";
import useHttp from "../../../hooks/useHttps";
import { useEffect, useState } from "react";

export default function ConditionModal({ open, setOpen, id, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const handleGetData = async () => {
    setLoading(true);

    await httpService
      .get("/AdditionsAndDeductions/AdditionsAndDeductionDetail", {
        params: { additionsAndDeductionId: id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          setData(res.data?.additionsAndDeductionsDetailViewModel);
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
  };

  const customerTabs = [
    {
      key: "data",
      label: "اطلاعات",
      children: handleRenderTabContent("data", data),
    },
  ];

  useEffect(() => {
    if (open) handleGetData();
  }, [id]);

  if (id)
    return (
      <>
        <Modal
          loading={loading}
          className=""
          open={open}
          onCancel={handleClose}
          title={data && `اضافه کسری : "${data?.title}"`}
          footer={
            <Button onClick={handleClose} type="primary">
              بستن
            </Button>
          }
        >
          <Tabs
            // defaultActiveKey="phone"
            className="pt-5"
            items={customerTabs}
          />
        </Modal>
      </>
    );
}