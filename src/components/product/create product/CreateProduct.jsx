import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import MyDatePicker from "../../../common/MyDatePicker";
import { toast } from "react-toastify";
import UnitTab from "../product data/UnitTab";

export default function CreateCustomerModal({ open, setOpen, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [creatorsList, setCreatorsList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [pricingMethodGroupList, setPricingMethodGroupList] = useState([]);
  const [unitData, setUnitData] = useState(null);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    productName: yup.string().required("این فیلد را پر کنید"),
    productCategoryId: yup.number().required("این فیلد را پر کنید"),
    productUnits: yup
      .array()
      .of(
        yup.object().shape({
          unitId: yup.string().required("این فیلد را پر کنید"),
        })
      )
      .min(1, "این فیلد را پر کنید")
      .required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      productCode: null,
      productManualCode: null,
      productName: "",
      latinName: "",
      serviceProduct: false,
      isActive: true,
      natureOfProduct: null,
      storageConditions: "",
      productIsAllowedToUseSerial: true,
      productSerialNumber: "",
      description: "",
      manufactureDate: null,
      expiryDate: null,
      sku: null,
      productUnits: [
        {
          unitId: null,
          quantityInUnit: null,
        },
      ],
      productUnitWarehouseStocks: [
        // {
        //   productId: null,
        //   unitId: null,
        //   quantityInWarehouse: null,
        // },
      ],
      stockQuantity: 0,
      productCategoryId: null,
      productManufacturerProducts: [],
      pricingMethodGroupId: null,
    },

    validationSchema,

    onSubmit: (values) => {
      handleCreate(values);
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

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
      productUnits: [
        {
          unitId: values?.productUnits[0]?.unitId
            ? values?.productUnits[0].unitId
            : null,
          quantityInUnit: values?.productUnits[0]?.quantityInUnit
            ? values?.productUnits[0].quantityInUnit
            : 1,
        },
      ],
      productManufacturerProducts:
        values?.productManufacturerProducts &&
        values?.productManufacturerProducts?.length !== 0
          ? values?.productManufacturerProducts.map((cr) => {
              return { productId: 0, manufacturerId: cr };
            })
          : [],
    };

    await httpService
      .post("/Product/CreateProduct", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("کالا و خدمات با موفقیت تعریف شد");
          getNewList();
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
      .get("/ProductCategory/GetCategoriesForCreateProduct")
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
        title="تعریف کالا و خدمات جدید"
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
              ثبت
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نام کالا و خدمات</span>
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
                <span className="text-error text-xs">
                  {validation.errors.productName}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نوع کالا و خدمات</span>
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
                <span className="text-error text-xs">
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
                <span className="text-error text-xs">
                  {validation.errors.productManualCode}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>کد کالا :</span>
            <Input
              value={validation.values.productCode}
              name="productCode"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.productCode &&
              validation.errors.productCode && (
                <span className="text-error text-xs">
                  {validation.errors.productCode}
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
              <span className="text-error text-xs">
                {validation.errors.latinName}
              </span>
            )}
          </div>

          {!validation.values.serviceProduct && (
            <>
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
            </>
          )}

          {/* <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
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
                <span className="text-error text-xs">
                  {validation.errors.pricingMethodGroupId}
                </span>
              )}
          </div> */}

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
                <span className="text-error text-xs">
                  {validation.errors.productCategoryId}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>تامین کنندگان کالا :</span>
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
                <span className="text-error text-xs">
                  {validation.errors.productManufacturerProducts}
                </span>
              )}
          </div>

          <UnitTab
            unit={validation.values.productUnits[0]?.unitId}
            setUnit={(e) =>
              validation.setFieldValue("productUnits[0].unitId", e)
            }
            quantity={validation.values.productUnits[0]?.quantityInUnit}
            setQuantity={(e) =>
              validation.setFieldValue("productUnits[0].quantityInUnit", e)
            }
            setUnitData={setUnitData}
            error={
              validation.touched.productUnits && validation.errors.productUnits
                ? validation.errors.productUnits[0]?.unitId
                : ""
            }
          />

          {/* {validation.values.productIsAllowedToUseSerial && (
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
                  <span className="text-error text-xs">
                    {validation.errors.productSerialNumber}
                  </span>
                )}
            </div>
          )} */}

          {/* <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
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
              <span className="text-error text-xs">
                {validation.errors.sku}
              </span>
            )}
          </div> */}

          {!validation.values.serviceProduct &&
            validation.values.productIsAllowedToUseSerial && (
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
                    <span className="text-error text-xs">
                      {validation.errors.stockQuantity}
                    </span>
                  )}
              </div>
            )}

          {!validation.values.serviceProduct && (
            <div className="flex gap-1 flex-col items-start w-full mx-auto">
              <span>شروط نگهداری :</span>
              <Input.TextArea
                value={validation.values.description}
                name="description"
                onChange={validation.handleChange}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.description &&
                validation.errors.description && (
                  <span className="text-error text-xs">
                    {validation.errors.description}
                  </span>
                )}
            </div>
          )}

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
                <span className="text-error text-xs">
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
              <span className="text-error text-xs">
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
                <span className="text-error text-xs">
                  {validation.errors.productIsAllowedToUseSerial}
                </span>
              )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">کالا و خدمات خدماتی است؟</span>
            <Checkbox
              checked={validation.values.serviceProduct}
              name="serviceProduct"
              onChange={validation.handleChange}
              className="w-full"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.serviceProduct &&
              validation.errors.serviceProduct && (
                <span className="text-error text-xs">
                  {validation.errors.serviceProduct}
                </span>
              )}
          </div>
        </Form>
      </Modal>
    </>
  );
}
