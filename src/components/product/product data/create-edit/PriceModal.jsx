import { Button, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function PriceModal({
  open,
  setOpen,
  mode,
  data,
  productId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [priceList, setPriceList] = useState(null);
  const [unitList, setUnitList] = useState(null);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    price: yup.number().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      productPriceId: null,
      productId: null,
      unitId: null,
      price: null,
    },

    validationSchema,

    onSubmit: (values) => {
      if (mode === "create") {
        handleCreate(values);
      }
      if (mode === "edit") {
        handleEdit(values);
      }
    },
  });

  const handleClose = () => {
    setOpen(false);
    validation.resetForm();
  };

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      productPriceId: values?.productPriceId,
      productId: values?.productId,
      unitId: values?.unitId,
      price: parseInt(values?.price),
    };

    await httpService
      .post("/ProductUnitPrice/CreateProductUnitPrice", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ایجاد شد");
          validation.setFieldValue("unitId", null);
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      productPriceId: values?.productPriceId,
      productId: values?.productId,
      unitId: values?.unitId,
      price: values?.price,
    };

    await httpService
      .post("/ProductUnitPrice/EditProductUnitPrice", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ویرایش شد");
          handleClose();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleGetPriceList = async () => {
    let datas = [];

    await httpService
      .post("/Price/Prices")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.priceViewModelList?.map((pr) => {
            datas.push({ value: pr?.priceId, label: pr?.priceName });
          });
        }
      })
      .catch(() => {});

    setPriceList(datas);
  };

  const handleGetUnitList = async () => {
    let datas = [];

    await httpService
      .get("/Unit/Units")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.unitViewModelList?.map((pr) => {
            datas.push({ value: pr?.unitId, label: pr?.unitName });
          });
        }
      })
      .catch(() => {});

    setUnitList(datas);
  };

  useEffect(() => {
    if (mode === "edit" && data) {
      validation.setFieldValue("productId", productId);
      validation.setFieldValue("productPriceId", data?.productPriceId);
      validation.setFieldValue("unitId", data?.unitId);
      validation.setFieldValue("price", data?.price);
    }

    if (mode === "create" && data) {
      validation.setFieldValue("productId", data?.productId);
    }
  }, [data, productId]);

  useEffect(() => {
    handleGetPriceList();
    handleGetUnitList();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onCancel={handleClose}
        title={
          mode === "create" ? (
            <>تعریف قیمت برای کالا و خدمات</>
          ) : (
            <>{`ویرایش قیمت "${data?.connectorName}"`}</>
          )
        }
        footer={
          <div className="">
            <Button type="primary" danger onClick={handleClose}>
              لغو
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-3 pt-4"
        >
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نوع قیمت :</span>
            <Select
              options={priceList}
              value={validation.values.productPriceId}
              name="productPriceId"
              onChange={(e) => {
                validation.setFieldValue("productPriceId", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.productPriceId &&
              validation.errors.productPriceId && (
                <span className="text-red-300 text-xs">
                  {validation.errors.productPriceId}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>واحد از کالا و خدمات :</span>
            <Select
              options={unitList}
              value={validation.values.unitId}
              name="unitId"
              onChange={(e) => {
                validation.setFieldValue("unitId", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.unitId && validation.errors.unitId && (
              <span className="text-red-300 text-xs">
                {validation.errors.unitId}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>میزان قیمت :</span>
            <Input
              min={0}
              type="number"
              value={validation.values.price}
              name="price"
              onChange={(e) => {
                validation.setFieldValue("price", e.target.value);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.price && validation.errors.price && (
              <span className="text-red-300 text-xs">
                {validation.errors.price}
              </span>
            )}
          </div>

          {/* submit button */}
          <div className="w-full flex justify-center py-10">
            <Button
              type="primary"
              loading={loading}
              disabled={loading}
              htmlType="submit"
            >
              ثبت
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
