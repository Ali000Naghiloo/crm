import { Button, Checkbox, Input, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useSelector } from "react-redux";
import useHttp from "../../../../hooks/useHttps";

export default function ProductLimits({ values, setField }) {
  const { httpService } = useHttp();
  const [productList, setProductList] = useState(null);
  const [productCategoryList, setProductCategoryList] = useState(null);
  // const allEnum = useSelector((state) => state.allEnum.allEnum);

  const defaultRow = {
    timePeriod: 0,
    startDate: "2024-09-23T09:06:05.197Z",
    endDate: "2024-09-23T09:06:05.197Z",
    dayOfWeek: 0,
    month: 0,
    season: 0,
    allTimePeriodsShouldBeTakenExceptDesignatedPeriod: true,
    iranCities: 0,
    allAreasExceptWhereSpecified: true,
    description: "",
  };

  const columns = [
    {
      title: "محصولات",
      dataIndex: "products",
      key: "products",
      render: (value, record) => {
        return (
          <Select
            className="w-[50%]"
            mode="multiple"
            maxTagCount={1}
            optionFilterProp="label"
            options={productList}
            value={value}
            onChange={(e) => handleCellChange(`factorProduct.products`, e)}
          />
        );
      },
    },
    {
      title: "دسته بندی محصول",
      dataIndex: "productCategories",
      key: "productCategories",
      render: (value, record) => {
        return (
          <Select
            className="w-[50%]"
            mode="multiple"
            maxTagCount={1}
            optionFilterProp="label"
            options={productCategoryList}
            value={value}
            onChange={(e) =>
              handleCellChange(`factorProduct.productCategories`, e)
            }
          />
        );
      },
    },
    {
      title: "حداقل تعداد کالا",
      dataIndex: "productAmountMin",
      key: "productAmountMin",
      render: (value, record) => {
        return (
          <div>
            <Input
              type="number"
              value={value}
              onChange={(e) =>
                handleCellChange(
                  `factorProduct.productAmountMin`,
                  e.target.value
                )
              }
            />
          </div>
        );
      },
    },
    {
      title: "حداکثر تعداد کالا",
      dataIndex: "productAmountMax",
      key: "productAmountMax",
      render: (value, record) => {
        return (
          <div>
            <Input
              type="number"
              value={value}
              onChange={(e) =>
                handleCellChange(
                  `factorProduct.productAmountMax`,
                  e.target.value
                )
              }
            />
          </div>
        );
      },
    },
    {
      title: "روز گذشته از تولید",
      dataIndex: "dayAfterManufactureDate",
      key: "dayAfterManufactureDate",
      render: (value, record) => {
        return (
          <div>
            <Input
              min={0}
              type="number"
              value={value}
              onChange={(e) =>
                handleCellChange(
                  `factorProducts[${
                    record?.index - 1
                  }].dayAfterManufactureDate`,
                  e.target.value
                )
              }
            />
          </div>
        );
      },
    },
    {
      title: "محصول استثنا باشد",
      dataIndex: "allProductsExcept",
      key: "allProductsExcept",
      render: (value, record) => (
        <div>
          <Checkbox
            checked={value}
            onChange={(e) => {
              handleCellChange(
                `factorProduct.allProductsExcept`,
                e.target.checked
              );
            }}
          />
        </div>
      ),
    },
    {
      title: "توضیحات",
      dataIndex: "description",
      key: "description",
      render: (value, record) => {
        return (
          <div>
            <Input
              className="max-w-[100px]"
              value={value}
              onChange={(e) =>
                handleCellChange(`factorProduct.description`, e.target.value)
              }
            />
          </div>
        );
      },
    },
  ];

  const handleCellChange = (field, value) => {
    setField(`${field}`, value);
  };

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

    setProductCategoryList(datas);
  };

  useEffect(() => {
    handleGetProductList();
    handleGetProductCatList();
  }, []);

  return (
    <div className="w-full overflow-auto">
      <div className="w-full overflow-x-auto flex flex-wrap gap-6">
        {columns.map((col, index) => {
          return (
            <div
              key={col.key}
              className="flex gap-3 items-center min-w-[300px] md:min-w-[460px] mx-auto"
            >
              <span className="font-bold w-[50%] text-end">{col.title} : </span>
              {col.render(values[`${col.dataIndex}`])}
            </div>
          );
        })}
      </div>
    </div>
  );
}
