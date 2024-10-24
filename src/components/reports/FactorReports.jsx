import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import useHttp from "../../hooks/useHttps";
import {
  Button,
  Collapse,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  Tag,
} from "antd";
import { toast } from "react-toastify";
import { HiRefresh } from "react-icons/hi";
import { setPageRoutes } from "../../store/reducers/pageRoutes";
import PageRoutes from "../../common/PageRoutes";
import { useNavigate } from "react-router-dom";
import formatHelper from "../../helper/formatHelper";
import { useFormik } from "formik";
import MyDatePicker from "../../common/MyDatePicker";

// pageType {
// }

export default function Factors({ pageType }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [pageList, setPageList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  // filter lists
  const [customerList, setCustomerList] = useState(null);
  const [productList, setProductList] = useState(null);
  const [productCatList, setProductCatList] = useState(null);

  const validation = useFormik({
    initialValues: {
      factorNumber: null,
      minFactorNumber: null,
      maxFactorNumber: null,
      factorType: null,
      minTotalFactorPrice: 0,
      maxTotalFactorPrice: 0,
      productCategoryIds: [],
      productIds: [],
      customerIds: [],
      startDate: null,
      endDate: null,
    },

    onSubmit: (values) => {
      handleGetList(values);
    },
  });

  const columns = [
    {
      title: "ردیف",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      key: "index",
    },
    {
      title: "شماره فاکتور",
      dataIndex: "factorNumber",
      sorter: (a, b) => a.factorNumber - b.factorNumber,
      key: "factorNumber",
    },
    {
      title: "شخص",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "نوع",
      dataIndex: "factorType",
      render: (value) => <>{allEnum?.FactorType[value]}</>,
      key: "factorType",
    },
    {
      title: "مسئولین فاکتور",
      dataIndex: "factorResponsibles",
      render: (value) => (
        <>
          {value && value?.length !== 0
            ? value?.map((v, index) => (
                <Tag color="cyan-inverse" key={index}>
                  {v?.user}
                </Tag>
              ))
            : "-"}
        </>
      ),
      key: "factorResponsibles",
    },
    {
      title: "قیمت کل فاکتور",
      dataIndex: "totalFactorPrice",
      render: (value) => <>{value ? formatHelper.numberSeperator(value) : 0}</>,
      key: "totalFactorPrice",
    },
    {
      title: "عملیات",
      render: (data) => (
        <div className="flex gap-2">
          <Button onClick={() => {}} size="middle" type="primary">
            اطلاعات تکمیلی
          </Button>
          <Button
            onClick={() => {
              navigate("/factors/create", {
                state: {
                  type: pageType,
                  data: data,
                  id: data?.factorId,
                },
              });
            }}
            size="middle"
            type="primary"
          >
            ویرایش
          </Button>
          <Popconfirm
            cancelText="خیر"
            okText="بله"
            title="آیا از حذف این فاکتور اطمینان دارید؟"
            placement="topRight"
            onConfirm={() => handleDelete(data?.factorId)}
          >
            <Button size="middle" type="primary" danger>
              حذف
            </Button>
          </Popconfirm>
        </div>
      ),
      key: "actions",
    },
  ];

  const handleDelete = async (id) => {
    setLoading(true);

    await httpService
      .get("/Factor/DeleteFactor", {
        params: { factorId: id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1)
          toast.success("با موفقیت حذف شد");
      })
      .catch(() => {});

    handleGetList();
    setLoading(false);
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPerPage(pagination.pageSize);
  };

  const handleGetList = async () => {
    setLoading(true);
    const formData = { ...validation.values };

    await httpService
      .post("/Report/GetFactors", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          let datas = [];
          res.data.factorViewModelList.map((data, index) => {
            datas.push({ ...data, index: index + 1, key: index });
          });
          setPageList(datas);
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
            datas.push({
              value: pr?.productId,
              label: pr?.productName,
              data: pr,
            });
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

  // filter options
  const handleRenderFilterOptions = () => {
    return (
      <>
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex justify-start flex-wrap gap-2 p-0"
        >
          {/* factor number */}
          <div className="w-[200px] mx-auto flex flex-col gap-1 mt-5">
            <span>شماره فاکتور : </span>
            <Input
              type="number"
              value={validation.values.factorNumber}
              onChange={validation.handleChange}
              name="factorNumber"
            />
          </div>

          {/* factor number (range) */}
          <div className="w-[200px] mx-auto flex flex-col gap-1 mt-5">
            <span>شماره فاکتور (مابین): </span>
            <div className="w-full flex">
              <Input
                type="number"
                value={validation.values.minFactorNumber}
                onChange={validation.handleChange}
                name="minFactorNumber"
              />
              <Input
                type="number"
                min={validation.values.minFactorNumber}
                value={validation.values.maxFactorNumber}
                onChange={validation.handleChange}
                name="maxFactorNumber"
              />
            </div>
          </div>

          {/* factor type */}
          <div className="w-[200px] mx-auto flex flex-col gap-1 mt-5">
            <span>نوع فاکتور : </span>
            <Select
              options={allEnum?.FactorType?.map((v, index) => {
                return { label: v, value: index };
              })}
              type="number"
              value={validation.values.factorType}
              onChange={(e) => {
                validation.setFieldValue("factorType", e);
              }}
              name="factorType"
            />
          </div>

          {/* customers */}
          <div className="w-[200px] mx-auto flex flex-col gap-1 mt-5">
            <span>اشخاص : </span>
            <Select
              mode="multiple"
              optionFilterProp="label"
              options={customerList}
              type="number"
              value={validation.values.customerIds}
              onChange={(e) => {
                validation.setFieldValue("customerIds", e);
              }}
              name="customerIds"
            />
          </div>

          {/* factor price (range) */}
          <div className="w-[200px] mx-auto flex flex-col gap-1 mt-5">
            <span>مبلغ فاکتور (مابین): </span>
            <div className="w-full flex">
              <Input
                type="number"
                value={validation.values.minTotalFactorPrice}
                onChange={validation.handleChange}
                name="minTotalFactorPrice"
              />
              <Input
                type="number"
                min={validation.values.minTotalFactorPrice}
                value={validation.values.maxTotalFactorPrice}
                onChange={validation.handleChange}
                name="maxTotalFactorPrice"
              />
            </div>
          </div>

          {/* products */}
          <div className="w-[200px] mx-auto flex flex-col gap-1 mt-5">
            <span>کالا و خدمات : </span>
            <Select
              mode="multiple"
              optionFilterProp="label"
              options={productList}
              type="number"
              value={validation.values.productIds}
              onChange={(e) => {
                validation.setFieldValue("productIds", e);
              }}
              name="productIds"
            />
          </div>

          {/* products category */}
          <div className="w-[200px] mx-auto flex flex-col gap-1 mt-5">
            <span>دسته بندی کالا و خدمات : </span>
            <Select
              mode="multiple"
              optionFilterProp="label"
              options={productCatList}
              type="number"
              value={validation.values.productCategoryIds}
              onChange={(e) => {
                validation.setFieldValue("productCategoryIds", e);
              }}
              name="productCategoryIds"
            />
          </div>

          {/* date */}
          <div className="w-[300px] mx-auto flex flex-col gap-1 mt-5">
            <span>تاریخ : </span>
            <div className="flex">
              <MyDatePicker
                value={validation.values.startDate}
                setValue={(e) => validation.setFieldValue("startDate", e)}
                className={"w-full"}
              />
              <MyDatePicker
                value={validation.values.endDate}
                setValue={(e) => validation.setFieldValue("endDate", e)}
                className={"w-full"}
              />
            </div>
          </div>

          {/* submit */}
          <div className="w-full flex justify-center items-center mt-10">
            <Button
              htmlType="submit"
              className="w-[120px]"
              type="primary"
              size="large"
            >
              تایید
            </Button>
          </div>
        </Form>
      </>
    );
  };

  useEffect(() => {
    dispatch(
      setPageRoutes([{ label: "فاکتور ها" }, { label: "گزارش گیری فاکتور ها" }])
    );

    // handleGetList();
    handleGetProductList();
    handleGetProductCatList();
    handleGetCustomerList();
  }, []);

  return (
    <Suspense fallback={<></>}>
      <div className="w-full h-full p-2 md:p-5">
        {/* page title */}
        <div className="w-full flex justify-between text-4xl py-5 font-bold">
          <h1>گزارش گیری</h1>

          <div className="flex items-center justify-center pl-5">
            <Button className="p-1" type="text" onClick={handleGetList}>
              <HiRefresh size={"2em"} />
            </Button>
          </div>
        </div>

        {/* routes */}
        <div>
          <PageRoutes />
        </div>

        {/* options */}
        <div className="flex justify-center gap-5 py-5">
          <Collapse
            defaultActiveKey={"filter"}
            className="w-full"
            items={[
              {
                key: "filter",
                label: <div className="font-bold text-xl">فیلتر ها</div>,
                children: handleRenderFilterOptions(),
              },
            ]}
          />
        </div>

        {/* content */}
        <div className="max-w-[100%] py-5 overflow-x-auto">
          <Table
            className="max-w-full"
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
            expandable={{
              expandedRowRender: (record) => (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <b>توضیحات : </b>
                    <p>{record?.description}</p>
                  </div>
                </div>
              ),
            }}
          />
        </div>
      </div>
    </Suspense>
  );
}
