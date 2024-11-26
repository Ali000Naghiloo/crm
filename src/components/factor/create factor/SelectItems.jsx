import { Button, Input, Popconfirm, Select } from "antd";
import MyDatePicker from "../../../common/MyDatePicker";
import { useTable } from "react-table";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/useHttps";
import { BsPlusLg } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import formatHelper from "../../../helper/formatHelper";

export default function SelectItems({ validation, factorType }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  // select list items
  const [productList, setProductList] = useState(null);
  const [productCatList, setProductCatList] = useState(null);
  const [customerList, setCustomerList] = useState(null);
  // const [employeeList, setEmployeeList] = useState(null);
  const [totals, setTotals] = useState({ quantity: 0, price: 0 });
  const [unitList, setUnitList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [roleList, setRoleList] = useState(null);

  // row counter
  const [count, setCount] = useState(1);

  const handleAdd = () => {
    const newData = { ...defaultData, itemRow: count + 1, key: count };
    setCount(count + 1);
    validation.setFieldValue("factorItemCreateViewModels", [
      ...validation.values.factorItemCreateViewModels,
      newData,
    ]);
    setCount(count + 1);
  };
  const handleDelete = (key) => {
    const newData = validation.values.factorItemCreateViewModels.filter(
      (item) => item.key !== key
    );
    validation.setFieldValue("factorItemCreateViewModels", newData);
    setCount(count - 1);
  };

  const defaultData = {
    itemRow: 1,
    productId: null,
    productCategoryId: null,
    unitId: null,
    quantity: 0,
    productUnitPrice: 0,
    discount: 0,
    inventory: 0,
    description: "",
    totalPrice: 0,
    factorItemResponsibleId: null,
  };

  const defaultColumns = [
    {
      title: "شماره ردیف",
      dataIndex: "itemRow",
      inputType: "number",
    },
    {
      title: "کالا و خدمات",
      dataIndex: "productId",
      inputType: "select",
      render: (value) => <Select options={productList} value={value} />,
      editable: true,
    },
    {
      title: "",
      dataIndex: "productCategorytId",
      inputType: "select",
      render: (value) => <Select options={productList} value={value} />,
      editable: null,
    },
    {
      title: "واحد",
      dataIndex: "unitId",
      render: (value) => <Select options={unitList} value={value} />,
      editable: true,
    },
    {
      title: "مقدار",
      dataIndex: "quantity",
      editable: true,
    },
    {
      title: "موجودی کل",
      dataIndex: "inventory",
      editable: true,
    },
    {
      title: "قیمت واحد کالا و خدمات",
      dataIndex: "productUnitPrice",
      editable: true,
    },
    {
      title: "تخفیف",
      dataIndex: "discount",
      editable: true,
    },
    {
      title: "مبلغ کل",
      dataIndex: "totalPrice",
      editable: true,
    },
    {
      title: "توضیحات",
      dataIndex: "description",
      editable: true,
    },
    {
      title: "عملیات",
      dataIndex: "actions",
      render: (_, record) => (
        <Button
          title="آیا از حذف کردن مطمئن هستید ؟"
          onClick={() => handleDelete(record.key)}
        >
          <a>حذف</a>
        </Button>
      ),
    },
  ];

  const columns = defaultColumns.map((item, index) => {
    return {
      title: item.title,
      accessor: item.dataIndex,
      isVisible: item.editable,
      key: index,
    };
  });

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
          datas = res.data?.customerList;
        }
      })
      .catch(() => {});

    setCustomerList(datas);
  };
  // const handleGetUnitList = async () => {
  //   let datas = [];

  //   await httpService
  //     .get("/Unit/Units")
  //     .then((res) => {
  //       if (res.status === 200 && res.data?.code === 1) {
  //         res.data?.unitViewModelList?.map((pr) => {
  //           datas.push({
  //             value: pr?.unitId,
  //             label: pr?.unitName,
  //           });
  //         });
  //       }
  //     })
  //     .catch(() => {});

  //   setUnitList(datas);
  // };
  const handleGetFactorCode = async () => {
    setLoading(true);

    await httpService
      .get("/Factor/FactorCod")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          validation.setFieldValue("factorNumber", res.data?.factorNumber);
        }
      })
      .catch(() => {
        return null;
      });

    setLoading(false);
  };

  const handleRenderProductUnitList = ({ value, onChange, productId }) => {
    let options = unitList.filter((u) => {
      if (u?.product == productId) {
        return u?.list;
      }
    });

    return (
      <Select
        className="w-[90px]"
        value={value}
        options={options[0]?.list ? options[0].list : []}
        onChange={onChange}
        fieldNames={{ label: "unit", value: "unitId" }}
      />
    );
  };

  const updateMyData = (rowIndex, columnId, value) => {
    validation.setFieldValue(
      `factorItemCreateViewModels[${rowIndex}][${columnId}]`,
      value
    );
  };

  // components
  const EditableCell = ({
    value: initialValue,
    row,
    column: { id },
    // updateMyData,
    editable,
  }) => {
    const [value, setValue] = useState(initialValue);
    const [units, setUnits] = useState([]);
    const [prices, setPrices] = useState([]);

    const onChange = (value) => {
      setValue(value);
    };

    const onBlur = () => {
      updateMyData(row.index, id, value);

      if (id === "quantity") {
        handleQuantityChange(value);
      }
      if (id === "productUnitPrice") {
        handleProductUnitPriceChange(value);
      }
    };

    const handleQuantityChange = (value, unitPrice) => {
      onChange(value);

      updateMyData(row.index, "quantity", value);
      updateMyData(
        row.index,
        "totalPrice",
        value *
          (unitPrice
            ? unitPrice
            : validation.values.factorItemCreateViewModels[row.index][
                "productUnitPrice"
              ])
      );
    };

    const handleProductUnitPriceChange = (value) => {
      // updateMyData(row.index, id, value);
      updateMyData(row.index, "productUnitPrice", value);
      updateMyData(
        row.index,
        "totalPrice",
        value *
          validation.values.factorItemCreateViewModels[row.index]["quantity"]
      );
    };

    const handleProductChange = async (event) => {
      const priceFormData = {
        customerId: validation?.values.customerId,
        productId: event.data?.productId,
        productCategoryId: event.data?.productCategoryId,
        unitId: event.data["productUnitPrices"][0]?.unitId,
        factorType: factorType,
      };

      updateMyData(row.index, "productId", event.data?.productId);
      updateMyData(
        row.index,
        "productCategoryId",
        event.data?.productCategoryId
      );
      updateMyData(row.index, "inventory", event.data?.stockQuantity);
      await httpService
        .post("/Factor/GetFactorItemProductUnitPrice", priceFormData)
        .then((res) => {
          if (res.status === 200 && res.data?.code === 1) {
            setUnitList([
              ...unitList,
              {
                product: res.data?.productViewModel?.productId,
                list: res.data?.productViewModel?.productUnits,
              },
            ]);
            setPriceList([
              ...priceList,
              {
                product: res.data?.productViewModel?.productId,
                list: res.data?.productViewModel?.productUnitPrices,
              },
            ]);
            updateMyData(
              row.index,
              "unitId",
              res.data.productViewModel.productUnits[0].unitId
            );
            handleProductUnitPriceChange(
              res.data.productViewModel.productUnitPrices[0].price
            );
            handleQuantityChange(
              1,
              res.data.productViewModel.productUnitPrices[0].price
            );
          }
        })
        .catch(() => {});
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (
      editable &&
      (id === "totalPrice" || id === "inventory" || id === "itemRow")
    ) {
      return (
        <Input
          type="number"
          min={0}
          className="w-[100px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      );
    }
    if (editable && id === "discount") {
      return (
        <Input
          type="number"
          min={0}
          className="w-[100px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      );
    }
    if (editable && id === "productId") {
      return (
        <div className="flex gap-1">
          <Select
            optionFilterProp="label"
            showSearch
            onKeyDown={() => {}}
            className="min-w-[120px]"
            value={value}
            options={productList}
            onBlur={onBlur}
            onChange={(e, event) => {
              setValue(e);
              handleProductChange(event);
            }}
          />
        </div>
      );
    }
    if (editable && id === "unitId") {
      return (
        <div className="flex gap-1">
          {handleRenderProductUnitList({
            value: row.values?.unitId,
            onChange: (e, event) => {
              setValue(e);
              updateMyData(row.index, id, event.unitId);
            },
            productId: row.values.productId,
          })}
        </div>
      );
    }
    if (editable && id === "quantity") {
      return (
        <div className="flex gap-1">
          <Input
            type="number"
            min={0}
            className="w-[80px]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          />
        </div>
      );
    }
    if (editable && id === "productUnitPrice") {
      return (
        <Select
          optionFilterProp="prodcut"
          showSearch
          options={prices}
          onClick={() => {
            priceList.filter((p) => {
              p?.product == row.values?.productId ? setPrices(p?.list) : null;
            });
          }}
          fieldNames={{ label: "productPrice", value: "price" }}
          className="w-[150px]"
          value={value}
          onChange={(e) => {
            setValue(e);
            handleProductUnitPriceChange(e);
            handleQuantityChange(row.values?.quantity, e);
          }}
          onBlur={onBlur}
        />
      );
    }
    if (editable && id === "description") {
      return (
        <Input
          className="w-[100px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      );
    }
    if (editable && id === "actions") {
      return (
        <div className="flex gap-1">
          <Button
            onClick={() => {
              if (row.index > 0) {
                handleDelete(row.index);
              }
            }}
            danger
            disabled={row.index == 0}
          >
            حذف
          </Button>
          <Button type="primary" onClick={handleAdd}>
            <BsPlusLg />
          </Button>
        </div>
      );
    }
  };

  const Table = ({ columns, data, updateMyData }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable({
        columns,
        data,
        defaultColumn: { Cell: EditableCell },
        updateMyData,
      });

    const handleKeyDown = useCallback(
      (e, rowIndex, columnId) => {
        const { key } = e;
        const totalRows = rows.length;
        const totalCols = columns.length;

        if (key === "ArrowDown" && rowIndex < totalRows - 1) {
          e.preventDefault();
          document.getElementById(`cell-${rowIndex + 1}-${columnId}`).focus();
        } else if (key === "ArrowUp" && rowIndex > 0) {
          e.preventDefault();
          document.getElementById(`cell-${rowIndex - 1}-${columnId}`).focus();
        } else if (key === "ArrowRight" && columnId < totalCols + 1) {
          e.preventDefault();
          document.getElementById(`cell-${rowIndex}-${columnId - 1}`).focus();
        } else if (key === "ArrowLeft" && columnId >= 0) {
          e.preventDefault();
          document.getElementById(`cell-${rowIndex}-${columnId + 1}`).focus();
        }
      },
      [rows, columns]
    );

    return (
      <table {...getTableProps()} className="max-w-[100%] overflow-x-auto">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) =>
                column?.title ? (
                  <th {...column.getHeaderProps()}>{column.render("title")}</th>
                ) : (
                  <th></th>
                )
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, j) => (
                  <td
                    {...cell.getCellProps()}
                    id={`cell-${i}-${j}`}
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, i, j)}
                  >
                    {cell.render("Cell", { editable: true })}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // get lists request
  useEffect(() => {
    handleGetFactorCode();

    handleGetProductList();
    handleGetProductCatList();
    handleGetCustomerList();
    // handleGetUnitList();
    // handleGetEmployeesList();
  }, []);

  useEffect(() => {
    if (validation.values.factorItemCreateViewModels.length !== 0) {
      // count factor totals
      let prices = 0;
      let quantity = 0;
      let discount = 0;
      validation.values.factorItemCreateViewModels.map((value) => {
        prices += parseInt(value.totalPrice);
        quantity += parseInt(value.quantity);
        discount += parseInt(value.discount);
      });

      // set factor totals
      validation.setFieldValue("totalFactorPrice", prices - discount);
      validation.setFieldValue("totalFactorQuantity", quantity);
      setTotals({ quantity: quantity, price: prices - discount });
    }
  }, [validation.values]);

  return (
    <div className="w-full flex flex-wrap">
      <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
        <span>تاریخ ثبت :</span>
        <MyDatePicker
          value={validation.values.factorDate}
          setValue={(e) => {
            validation.setFieldValue("factorDate", e);
          }}
          className={"w-[300px]"}
          status={
            validation.touched.factorDate &&
            validation.errors.factorDate &&
            "error"
          }
        />
      </div>

      {!validation?.customerId && (
        <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
          <span>شخص :</span>
          <Select
            showSearch
            optionFilterProp="customerName"
            fieldNames={{ label: "customerName", value: "customerId" }}
            loading={!customerList ? true : false}
            options={customerList}
            value={validation.values.customerId}
            onChange={(e, event) => {
              setRoleList(event?.roleMappings);
              validation.setFieldValue("customerId", e);
              event?.roleMappings
                ? validation.setFieldValue(
                    "customerRoleId",
                    event.roleMappings[0]?.customerRoleId
                  )
                : null;
            }}
            className="w-full"
            placeholder="انتخاب کنید..."
          />
          {validation.touched.customerId && validation.errors.customerId && (
            <span className="text-error text-xs">
              {validation.errors.customerId}
            </span>
          )}
        </div>
      )}

      {validation.values?.customerId && roleList && (
        <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
          <span>نقش شخص :</span>
          <Select
            showSearch
            optionFilterProp="customerRole"
            fieldNames={{ label: "customerRole", value: "customerRoleId" }}
            loading={!roleList ? true : false}
            options={roleList}
            value={validation.values.customerRoleId}
            onChange={(e) => {
              validation.setFieldValue("customerRoleId", e);
            }}
            className="w-full"
            placeholder="انتخاب کنید..."
          />
          {validation.touched.customerRoleId &&
            validation.errors.customerRoleId && (
              <span className="text-error text-xs">
                {validation.errors.customerRoleId}
              </span>
            )}
        </div>
      )}

      {validation?.values?.customerId && (
        <div className="w-full max-w-[100%] flex flex-col gap-2 py-5">
          <div className="w-ful flex justify-between px-8 mt-8">
            <span className="text-2xl font-bold">
              کالا و خدمات ها این فاکتور
            </span>

            <Popconfirm
              title="از پاک کردن تمامی موارد فاکتور مطمئن هستید؟"
              onConfirm={() =>
                validation.setFieldValue("factorItemCreateViewModels", [
                  defaultData,
                ])
              }
            >
              <Button danger type="primary">
                <MdDelete />
              </Button>
            </Popconfirm>
          </div>

          {/* product list in factor */}
          <div className="w-full overflow-x-auto flex flex-col justify-start xl:justify-center mt-5">
            <Table
              columns={columns}
              data={validation.values.factorItemCreateViewModels}
              // updateMyData={updateMyData}
            />

            <div className="w-full flex gap-2 flex-col items-center justify-center p-10">
              <div className="flex gap-2">
                <span>مقدار کل:</span>
                <span className="font-bold text-lg">{totals.quantity}</span>
              </div>
              <div className="flex gap-2">
                <span>مبلغ کل:</span>
                <span className="font-bold text-lg">
                  {formatHelper.numberSeperator(totals.price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
