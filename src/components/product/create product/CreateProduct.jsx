import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import MyDatePicker from "../../../common/MyDatePicker";
import { toast } from "react-toastify";

export default function CreateCustomerModal({ open, setOpen, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [creatorsList, setCreatorsList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [pricingMethodGroupList, setPricingMethodGroupList] = useState([]);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    productName: yup.string().required("این فیلد را پر کنید"),
    manufactureDate: yup.string().required("این فیلد را پر کنید"),
    expiryDate: yup.string().required("این فیلد را پر کنید"),
    productCategoryId: yup.number().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      productCode: null,
      productManualCode: null,
      productName: "",
      latinName: "",
      serviceProduct: true,
      isActive: true,
      natureOfProduct: null,
      storageConditions: "",
      productIsAllowedToUseSerial: true,
      productSerialNumber: "",
      description: "",
      manufactureDate: "",
      expiryDate: "",
      sku: null,
      stockQuantity: 0,
      productCategoryId: null,
      productManufacturerProducts: [],
      pricingMethodGroupId: null,
    },

    validationSchema,

    onSubmit: (values) => {
      handleCreateProduct(values);
    },
  });

  const handleClose = () => {
    if (!loading) {
      validation.resetForm();
      setOpen(false);
    }
  };

  const handleGetCustomerCode = async () => {
    await httpService
      .get("/Product/ProductCod")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          validation.setFieldValue("productCode", res.data?.productCod);
        }
      })
      .catch(() => {
        return null;
      });
  };

  const handleCreateProduct = async (values) => {
    setLoading(true);
    const formData = {
      productCode: values?.productCode,
      productManualCode: values?.productManualCode,
      productName: values?.productName,
      latinName: values?.latinName,
      serviceProduct: values?.serviceProduct,
      isActive: values?.isActive,
      natureOfProduct: values?.natureOfProduct,
      storageConditions: values?.storageConditions,
      productIsAllowedToUseSerial: values?.productIsAllowedToUseSerial,
      productSerialNumber: values?.productSerialNumber,
      manufactureDate: values?.manufactureDate,
      expiryDate: values?.expiryDate,
      sku: values?.sku,
      stockQuantity: values?.stockQuantity,
      productCategoryId: values?.productCategoryId,
      productManufacturerProducts:
        values?.productManufacturerProducts &&
        values?.productManufacturerProducts?.length !== 0
          ? values?.productManufacturerProducts.map((cr) => {
              return { productId: 0, manufacturerId: cr };
            })
          : null,
      pricingMethodGroupId: values?.pricingMethodGroupId,
      description: values?.description,
    };

    await httpService
      .post("/Product/CreateProduct", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("محصول با موفقیت ساخته شد");
          handleClose();
        }
      })
      .catch(() => {});

    getNewList();
    setLoading(false);
  };

  const handleGetCategoryList = async () => {
    let datas = [];
    setCategoryList(null);

    await httpService
      .get("/ProductCategory/GetAllCategories")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.categoryViewModelList?.map((pr) => {
            datas.push({ label: pr.categoryName, value: pr.productCategoryId });
          });
        }
      })
      .catch(() => {});

    setCategoryList(datas);
  };

  const handleGetCreatorList = async () => {
    let datas = [];
    setCreatorsList(null);

    await httpService
      .get("/Manufacturer/Manufacturers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.productManufacturerViewModelList?.map((cr) => {
            datas.push({ label: cr.name, value: cr.manufacturerId });
          });
        }
      })
      .catch(() => {});

    setCreatorsList(datas);
  };

  const handleGetPricingMethodGroupList = async () => {
    let datas = [];
    setPricingMethodGroupList(null);

    await httpService
      .get("/PricingMethodGroup/PricingMethodGroups")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.pricingMethodGroupViewModelList?.map((cr) => {
            datas.push({
              label: cr.pricingMethodGroupTitle,
              value: cr.pricingMethodGroupId,
            });
          });
        }
      })
      .catch(() => {});

    setPricingMethodGroupList(datas);
  };

  useEffect(() => {
    handleGetCategoryList();
    handleGetCreatorList();
    handleGetPricingMethodGroupList();
  }, []);

  useEffect(() => {
    if (open) handleGetCustomerCode();
  }, [open]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        title="ساخت محصول جدید"
        className="!w-fit max-w-[1000px]"
        footer={
          <div className="flex justify-end gap-3 pt-5">
            <Button onClick={handleClose} type="primary" danger>
              لغو
            </Button>
            <Button
              onClick={validation.handleSubmit}
              type="primary"
              loading={loading}
              disabled={loading}
            >
              ثبت محصول جدید
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نام محصول</span>
            <Input
              value={validation.values.productName}
              onChange={(e) => {
                validation.setFieldValue("productName", e.target.value);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.productName &&
              validation.errors.productName && (
                <span className="text-red-300 text-xs">
                  {validation.errors.productName}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نوع محصول</span>
            <Select
              options={allEnum?.NatureOfProduct?.map((type, index) => {
                return { label: type, value: index };
              })}
              value={validation.values.natureOfProduct}
              onChange={(e) => {
                validation.setFieldValue("natureOfProduct", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.natureOfProduct &&
              validation.errors.natureOfProduct && (
                <span className="text-red-300 text-xs">
                  {validation.errors.natureOfProduct}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>کد دستی کالا :</span>
            <Input
              value={validation.values.productManualCode}
              name="productManualCode"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.productManualCode &&
              validation.errors.productManualCode && (
                <span className="text-red-300 text-xs">
                  {validation.errors.productManualCode}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نام لاتین :</span>
            <Input
              value={validation.values.latinName}
              name="latinName"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.latinName && validation.errors.latinName && (
              <span className="text-red-300 text-xs">
                {validation.errors.latinName}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>تاریخ تولید :</span>
            <MyDatePicker
              value={validation.values.manufactureDate}
              setValue={(e) => {
                validation.setFieldValue("manufactureDate", e);
                console.log(e);
              }}
              className={"w-[300px]"}
              status={
                validation.touched.manufactureDate &&
                validation.errors.manufactureDate &&
                "error"
              }
            />
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>تاریخ انقضا :</span>
            <MyDatePicker
              value={validation.values.expiryDate}
              setValue={(e) => {
                validation.setFieldValue("expiryDate", e);
              }}
              className={"w-[300px]"}
              status={
                validation.touched.expiryDate &&
                validation.errors.expiryDate &&
                "error"
              }
            />
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>گروه قیمت گذاری :</span>
            <Select
              options={pricingMethodGroupList}
              value={validation.values.pricingMethodGroupId}
              onChange={(e) => {
                validation.setFieldValue("pricingMethodGroupId", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.pricingMethodGroupId &&
              validation.errors.pricingMethodGroupId && (
                <span className="text-red-300 text-xs">
                  {validation.errors.pricingMethodGroupId}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>دسته بندی کالا :</span>
            <Select
              options={categoryList}
              value={validation.values.productCategoryId}
              onChange={(e) => {
                validation.setFieldValue("productCategoryId", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.productCategoryId &&
              validation.errors.productCategoryId && (
                <span className="text-red-300 text-xs">
                  {validation.errors.productCategoryId}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>سازندگان کالا :</span>
            <Select
              mode="multiple"
              allowClear
              options={creatorsList}
              value={validation.values.productManufacturerProducts}
              onChange={(e) => {
                validation.setFieldValue("productManufacturerProducts", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.productManufacturerProducts &&
              validation.errors.productManufacturerProducts && (
                <span className="text-red-300 text-xs">
                  {validation.errors.productManufacturerProducts}
                </span>
              )}
          </div>

          {validation.values.productIsAllowedToUseSerial && (
            <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
              <span>سریال کالا :</span>
              <Input
                min={0}
                type="number"
                value={validation.values.productSerialNumber}
                name="productSerialNumber"
                onChange={validation.handleChange}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.productSerialNumber &&
                validation.errors.productSerialNumber && (
                  <span className="text-red-300 text-xs">
                    {validation.errors.productSerialNumber}
                  </span>
                )}
            </div>
          )}

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>شماره سریال کالا در انبار :</span>
            <Input
              value={validation.values.sku}
              onChange={(e) => {
                validation.setFieldValue("sku", e.target.value);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.sku && validation.errors.sku && (
              <span className="text-red-300 text-xs">
                {validation.errors.sku}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>موجودی کالا در انبار :</span>
            <Input
              type="number"
              min={0}
              value={validation.values.stockQuantity}
              name="stockQuantity"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.stockQuantity &&
              validation.errors.stockQuantity && (
                <span className="text-red-300 text-xs">
                  {validation.errors.stockQuantity}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>شروط نگهداری :</span>
            <Input.TextArea
              value={validation.values.storageConditions}
              name="storageConditions"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.storageConditions &&
              validation.errors.storageConditions && (
                <span className="text-red-300 text-xs">
                  {validation.errors.storageConditions}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-full mx-auto">
            <span>توضیحات :</span>
            <Input.TextArea
              value={validation.values.description}
              name="description"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.description &&
              validation.errors.description && (
                <span className="text-red-300 text-xs">
                  {validation.errors.description}
                </span>
              )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">فعال است؟</span>
            <Checkbox
              checked={validation.values.isActive}
              name="isActive"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.isActive && validation.errors.isActive && (
              <span className="text-red-300 text-xs">
                {validation.errors.isActive}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">
              می تواند شماره سریال داشته باشد؟
            </span>
            <Checkbox
              checked={validation.values.productIsAllowedToUseSerial}
              name="productIsAllowedToUseSerial"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.productIsAllowedToUseSerial &&
              validation.errors.productIsAllowedToUseSerial && (
                <span className="text-red-300 text-xs">
                  {validation.errors.productIsAllowedToUseSerial}
                </span>
              )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">محصول خدماتی است؟</span>
            <Checkbox
              checked={validation.values.serviceProduct}
              name="serviceProduct"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.serviceProduct &&
              validation.errors.serviceProduct && (
                <span className="text-red-300 text-xs">
                  {validation.errors.serviceProduct}
                </span>
              )}
          </div>
        </Form>
      </Modal>
    </>
  );
}