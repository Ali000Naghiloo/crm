import { Button, Input, Popconfirm, Select } from "antd";
import MyDatePicker from "../../../common/MyDatePicker";
import { useTable } from "react-table";
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/useHttps";
import { BsPlusLg } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

export default function SelectItems({ validation, factorType }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);

  // select list items
  const [productList, setProductList] = useState(null);
  const [productCatList, setProductCatList] = useState(null);
  const [customerList, setCustomerList] = useState(null);
  const [unitList, setUnitList] = useState(null);
  // const [employeeList, setEmployeeList] = useState(null);

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
      title: "محصول",
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
      title: "تعداد",
      dataIndex: "quantity",
      editable: true,
    },
    {
      title: "موجودی کل",
      dataIndex: "inventory",
      editable: true,
    },
    {
      title: "قیمت واحد محصول",
      dataIndex: "productUnitPrice",
      editable: true,
    },
    {
      title: "تخفیف",
      dataIndex: "discount",
      editable: true,
    },
    {
      title: "فی کل",
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

  const updateMyData = (rowIndex, columnId, value) => {
    validation.setFieldValue(
      `factorItemCreateViewModels[${rowIndex}][${columnId}]`,
      value
    );
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
  const handleGetUnitList = async () => {
    let datas = [];

    await httpService
      .get("/Unit/Units")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.unitViewModelList?.map((pr) => {
            datas.push({
              value: pr?.unitId,
              label: pr?.unitName,
            });
          });
        }
      })
      .catch(() => {});

    setUnitList(datas);
  };
  const handleGetCustomerCode = async () => {
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

  // components
  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData,
    editable,
  }) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(e.target.value);
    };

    const handleQuantityChange = (value, unitPrice) => {
      // const value = e.target.value;

      updateMyData(index, "quantity", value);
      updateMyData(
        index,
        "totalPrice",
        value *
          (unitPrice
            ? unitPrice
            : validation.values.factorItemCreateViewModels[index][
                "productUnitPrice"
              ])
      );
    };

    const handleProductUnitPriceChange = (value) => {
      // updateMyData(index, id, value);
      updateMyData(index, "productUnitPrice", value);
      updateMyData(
        index,
        "totalPrice",
        value * validation.values.factorItemCreateViewModels[index]["quantity"]
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

      updateMyData(index, "productId", event.data?.productId);
      updateMyData(index, "unitId", event.data["productUnitPrices"][0]?.unitId);
      updateMyData(index, "productCategoryId", event.data?.productCategoryId);
      // updateMyData(index, "quantity", 1);
      updateMyData(index, "inventory", event.data?.stockQuantity);
      await httpService
        .post("/Factor/GetFactorItemProductUnitPrice", priceFormData)
        .then((res) => {
          if (res.status === 200 && res.data?.code === 1) {
            handleProductUnitPriceChange(res.data?.finalPrice);
            handleQuantityChange(1, res.data?.finalPrice);
          }
        })
        .catch(() => {});
    };

    const onBlur = () => {
      updateMyData(index, id, value);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (
      editable &&
      (id === "discount" ||
        id === "totalPrice" ||
        id === "inventory" ||
        id === "itemRow")
    ) {
      return (
        <Input
          type="number"
          min={0}
          className="w-[100px]"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      );
    }
    if (editable && id === "productUnitPrice") {
      return (
        <Input
          type="number"
          min={0}
          className="w-[100px]"
          value={value}
          onChange={(e) => handleProductUnitPriceChange(e.target.value)}
          onBlur={onBlur}
        />
      );
    }
    if (editable && id === "quantity") {
      return (
        <div className="flex gap-1">
          <Button
            onClick={() => {
              if (value - 1 >= 0) handleQuantityChange(value - 1);
            }}
          >
            -
          </Button>
          <Input
            type="number"
            min={0}
            className="w-[60px]"
            value={value}
            onChange={(e) => handleQuantityChange(e.target.value)}
            onBlur={onBlur}
          />
          <Button onClick={() => handleQuantityChange(value + 1)}>+</Button>
        </div>
      );
    }
    if (editable && id === "description") {
      return (
        <Input
          className="w-[100px]"
          value={value}
          onChange={onChange}
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
          <Select
            optionFilterProp="label"
            showSearch
            onKeyDown={() => {}}
            className="min-w-[120px]"
            value={value}
            options={unitList}
            onChange={(e) => {
              setValue(e);
              updateMyData(index, id, e);
            }}
          />
        </div>
      );
    }
    if (editable && id === "actions") {
      return (
        <div className="flex gap-1">
          <Button
            onClick={() => {
              if (index > 0) {
                handleDelete(index);
              }
            }}
            danger
            disabled={index == 0}
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
    handleGetCustomerCode();

    handleGetProductList();
    handleGetProductCatList();
    handleGetCustomerList();
    handleGetUnitList();
    // handleGetEmployeesList();
  }, []);

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
            optionFilterProp="label"
            options={customerList}
            value={validation.values.customerId}
            onChange={(e) => {
              validation.setFieldValue("customerId", e);
            }}
            className="w-full"
            placeholder="انتخاب کنید..."
          />
          {validation.touched.customerId && validation.errors.customerId && (
            <span className="text-red-300 text-xs">
              {validation.errors.customerId}
            </span>
          )}
        </div>
      )}

      <div className="w-full max-w-[100%] flex flex-col gap-2 py-5">
        <div className="w-ful flex justify-between px-8 mt-8">
          <span className="text-2xl font-bold">محصولات این فاکتور</span>

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
        <div className="w-full overflow-x-auto flex lg:justify-center">
          {/* <Table
                bordered
                components={components}
                scroll={{ x: "100%" }}
                rowClassName={() => "editable-row"}
                dataSource={validation.values.factorItemCreateViewModels}
                columns={columns}
                pagination={{}}
              /> */}

          {validation?.values?.customerId && (
            <Table
              columns={columns}
              data={validation.values.factorItemCreateViewModels}
              updateMyData={updateMyData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
