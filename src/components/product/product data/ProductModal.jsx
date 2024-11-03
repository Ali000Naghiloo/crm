import { Button, Modal, Tabs } from "antd";
import DataTab from "./DataTab";
import useHttp from "../../../hooks/useHttps";
import { lazy, Suspense, useEffect, useState } from "react";
import ColorTab from "./ColorTab";
import ImageTab from "./ImageTab";
import PriceTab from "./PriceTab";
import SizeTab from "./SizeTab";
import UnitTab from "./UnitTab";
import WeightTab from "./WeightTab";

export default function ProductModal({ open, setOpen, id, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const handleGetProductData = async () => {
    await httpService
      .get("/Product/GetProductDetail", {
        params: { productId: id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          setData(res.data?.productViewModel);
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
          setOpen={setOpen}
          getNewList={getNewList}
          handleClose={handleClose}
        />
      );
    }
    if (tabName === "price") {
      return <PriceTab data={data} />;
    }
    if (tabName === "color") {
      return <ColorTab data={data} />;
    }
    if (tabName === "image") {
      return <ImageTab data={data} getNewList={handleGetProductData} />;
    }
    if (tabName === "size") {
      return <SizeTab data={data} />;
    }
    if (tabName === "weight") {
      return <WeightTab data={data} />;
    }
    if (tabName === "unit") {
      return <UnitTab data={data} />;
    }
  };

  const productTabs = [
    {
      key: "data",
      label: "اطلاعات کالا و خدمات",
      children: handleRenderTabContent("data", data),
    },
    // {
    //   key: "color",
    //   label: "رنگ",
    //   children: handleRenderTabContent("color", data),
    // },
    // {
    //   key: "size",
    //   label: "اندازه ها",
    //   children: handleRenderTabContent("size", data),
    // },
    {
      key: "image",
      label: "عکس ها",
      children: handleRenderTabContent("image", data),
    },
    // {
    //   key: "weight",
    //   label: "وزن",
    //   children: handleRenderTabContent("weight", data),
    // },
    // {
    //   key: "unit",
    //   label: "واحد",
    //   children: handleRenderTabContent("unit", data),
    // },
    {
      key: "price",
      label: "قیمت بر حسب واحد",
      children: handleRenderTabContent("price", data),
    },
  ];

  useEffect(() => {
    if (open) handleGetProductData();
  }, [id, open]);

  if (id)
    return (
      <>
        <Modal
          loading={loading}
          className="md:!w-fit md:min-w-[700px] max-w-[1000px]"
          open={open}
          onCancel={handleClose}
          title={data && `کالا و خدمات : "${data?.productName}"`}
          footer={
            <Button onClick={handleClose} type="primary">
              بستن
            </Button>
          }
        >
          <Tabs defaultActiveKey="data" className="pt-5" items={productTabs} />
        </Modal>
      </>
    );
}
