import { Button, Checkbox, Form, Input, Modal, Select, Tabs } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ConditionModal({
  open,
  setOpen,
  mode,
  data,
  pricingMethodId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  // select list items
  const [productList, setProductList] = useState(null);
  const [productCatList, setProductCatList] = useState(null);
  const [customerList, setCustomerList] = useState(null);
  const [customerRoleList, setCustomerRoleList] = useState(null);
  const [editData, setEditData] = useState(null); //for edit mode
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    title: yup.string().required("لطفا این فیلد را پر کنید"),
    priority: yup.number().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      pricingMethodConditionId: null, // for edit
      pricingMethodId: null,
      title: "",
      description: "",
      priority: 0,
      products: null,
      productCategories: null,
      customers: null,
      customerRoles: null,
      isActive: true,
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
      pricingMethodId: pricingMethodId,
      title: values?.title,
      isActive: values?.isActive,
      description: values?.description,
      priority: values?.priority,
      products:
        values?.products && values?.products?.length !== 0
          ? values?.products?.join(", ")
          : null,
      productCategories:
        values?.productCategories && values?.productCategories?.length !== 0
          ? values?.productCategories?.join(", ")
          : null,
      customers:
        values?.customers && values?.customers?.length !== 0
          ? values?.customers?.join(", ")
          : null,
      customerRoles:
        values?.customerRoles && values?.customerRoles?.length !== 0
          ? values?.customerRoles?.join(", ")
          : null,
    };

    await httpService
      .post("/PricingMethodCondition/CreatePricingMethodCondition", formData)
      .then((res) => {
        if (res.status === 200) {
          setOpen(false);
          validation.resetForm();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      pricingMethodId: pricingMethodId,
      title: values?.title,
      isActive: values?.isActive,
      description: values?.description,
      priority: values?.priority,
      products: values?.products,
      productCategories: values?.productCategories,
      customers: values?.customers,
      customerRoles: values?.customerRoles,
    };

    await httpService
      .post("/PricingMethodCondition/EditPricingMethodCondition", formData)
      .then((res) => {
        if (res.status === 200) {
          setOpen(false);
          validation.resetForm();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  // get select list items
  const handleGetProductList = async () => {
    let datas = [];

    await httpService
      .get("/Product/GetAllProducts")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.productViewModelList?.map((pr) => {
            datas.push({ value: pr?.productId, label: pr?.productName });
          });
        }
      })
      .catch(() => {});

    setProductList(datas);
  };
  const handleGetProductCatList = async () => {
    let datas = [];

    await httpService
      .get("/ProductCategory/GetAllCategories")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.categoryViewModelList?.map((pr) => {
            datas.push({
              value: pr?.productCategoryId,
              label: pr?.categoryName,
            });
          });
        }
      })
      .catch(() => {});

    setProductCatList(datas);
  };
  const handleGetCustomerList = async () => {
    let datas = [];

    await httpService
      .get("/Customer/GetAllCustomers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.customerList?.map((pr) => {
            datas.push({
              value: pr?.customerId,
              label: pr?.customerName,
            });
          });
        }
      })
      .catch(() => {});

    setCustomerList(datas);
  };
  const handleGetCustomerRoleList = async () => {
    let datas = [];

    await httpService
      .get("/CustomerRole/GetAllCustomerRoles")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.customerRoleList?.map((pr) => {
            datas.push({
              value: pr?.customerRoleId,
              label: pr?.roleName,
            });
          });
        }
      })
      .catch(() => {});

    setCustomerRoleList(datas);
  };

  const handleGetConditionData = async () => {
    let datas = [];
    const formData = {
      pricingMethodConditionId: data?.pricingMethodConditionId,
    };

    await httpService
      .get("/PricingMethodCondition/PricingMethodConditionDetail", {
        params: formData,
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          setEditData(res.data?.pricingMethodConditionDetailViewModel);
        }
      })
      .catch(() => {});

    setProductList(datas);
  };

  useEffect(() => {
    handleGetProductList();
    handleGetProductCatList();
    handleGetCustomerList();
    handleGetCustomerRoleList();
  }, []);

  useEffect(() => {
    if (mode === "edit" && editData) {
      validation.setFieldValue("pricingMethodId", pricingMethodId);
      validation.setFieldValue("title", editData?.title);
      validation.setFieldValue("description", editData?.description);
      validation.setFieldValue("priority", editData?.priority);
      validation.setFieldValue("isActive", editData?.isActive);
      validation.setFieldValue(
        "products",
        editData?.products && editData?.products?.length !== 0
          ? editData?.products?.split(",")?.map((v) => {
              return parseInt(v);
            })
          : null
      );
      validation.setFieldValue(
        "productCategories",
        editData?.productCategories && editData?.productCategories?.length !== 0
          ? editData?.productCategories?.split(",")?.map((v) => {
              return parseInt(v);
            })
          : null
      );
      validation.setFieldValue(
        "customers",
        editData?.factorTypes && editData?.customers?.length !== 0
          ? editData?.customers?.split(",")?.map((v) => {
              return parseInt(v);
            })
          : null
      );
      validation.setFieldValue(
        "customerRoles",
        editData?.customerRoles && editData?.customerRoles?.length !== 0
          ? editData?.customerRoles?.split(",")?.map((v) => {
              return parseInt(v);
            })
          : null
      );
    }

    if (mode === "create" && pricingMethodId) {
      validation.setFieldValue("pricingMethodId", pricingMethodId);
    }
  }, [editData, pricingMethodId]);

  useEffect(() => {
    if (mode === "edit" && pricingMethodId) {
      handleGetConditionData();
    }
  }, [mode && pricingMethodId]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        title={
          mode === "create" ? (
            <>تعریف شرط قیمت گذاری</>
          ) : (
            <>ویرایش شرط : {data?.pricingMethodConditionTitle}</>
          )
        }
        footer={
          <div>
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
            <span>عنوان :</span>
            <Input
              value={validation.values.title}
              name="title"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.title && validation.errors.title && (
              <span className="text-red-300 text-xs">
                {validation.errors.title}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>اولویت :</span>
            <Input
              type="number"
              value={validation.values.priority}
              name="priority"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.priority && validation.errors.priority && (
              <span className="text-red-300 text-xs">
                {validation.errors.priority}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>کالا و خدمات ها :</span>
            <Select
              mode="multiple"
              maxTagCount={3}
              options={productList}
              value={validation.values.products}
              onChange={(e) => {
                validation.setFieldValue("products", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.products && validation.errors.products && (
              <span className="text-red-300 text-xs">
                {validation.errors.products}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>دسته بندی کالا و خدمات ها :</span>
            <Select
              mode="multiple"
              maxTagCount={3}
              options={productCatList}
              loading={productCatList ? false : true}
              value={validation.values.productCategories}
              onChange={(e) => {
                validation.setFieldValue("productCategories", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.productCategories &&
              validation.errors.productCategories && (
                <span className="text-red-300 text-xs">
                  {validation.errors.productCategories}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>اشخاص :</span>
            <Select
              maxTagCount={3}
              mode="multiple"
              options={customerList}
              value={validation.values.customers}
              onChange={(e) => {
                validation.setFieldValue("customers", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.customers && validation.errors.customers && (
              <span className="text-red-300 text-xs">
                {validation.errors.customers}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نقش اشخاص :</span>
            <Select
              maxTagCount={3}
              mode="multiple"
              options={customerRoleList}
              value={validation.values.customerRoles}
              onChange={(e) => {
                validation.setFieldValue("customerRoles", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.customerRoles &&
              validation.errors.customerRoles && (
                <span className="text-red-300 text-xs">
                  {validation.errors.customerRoles}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>توضیحات اضافه :</span>
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
              onChange={(e) => {
                validation.setFieldValue("isActive", e.target.checked);
              }}
              className="w-full"
            />
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
    </>
  );
}
