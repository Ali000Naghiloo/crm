import { Button, Checkbox, Form, Input, Modal, Popconfirm, Select } from "antd";
import { useFormik } from "formik";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import MyDatePicker from "../../../common/MyDatePicker";
import { toast } from "react-toastify";
import { BsPlusLg } from "react-icons/bs";
import { useTable } from "react-table";
import { MdDelete } from "react-icons/md";
import formatHelper from "../../../helper/formatHelper";

export default function CreateFactorModal({
  open,
  setOpen,
  getNewList,
  type,
  customerId,
  factorId,
  data,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  // select list items
  const [productList, setProductList] = useState(null);
  const [productCatList, setProductCatList] = useState(null);
  const [customerList, setCustomerList] = useState(null);
  const [unitList, setUnitList] = useState(null);
  const [employeeList, setEmployeeList] = useState(null);

  // footer items
  const [allFactorPrice, setAllFactorPrice] = useState(0);
  const [paymentMethod, setPeymantMethod] = useState(0);
  const [allConditions, setAllConditions] = useState(null);
  const [formDisabled, setFormDisabled] = useState(true);

  const [count, setCount] = useState(1);

  const allEnum = useSelector((state) => state.allEnum.allEnum);
  const userData = useSelector((state) => state.userData.userData);

  const validationSchema = yup.object().shape({
    customerId: yup.number().required("این فیلد را پر کنید"),
    factorDate: yup.string().required("این فیلد را پر کنید"),
  });

  const defaultData = {
    itemRow: 0,
    productId: null,
    productCategoryId: null,
    unitId: null,
    quantity: 0,
    productUnitPrice: 0,
    discount: 0,
    inventory: 0,
    description: "",
    totalPrice: 0,
    factorItemResponsibleId: "",
  };

  const validation = useFormik({
    initialValues: {
      factorNumber: 0,
      factorDate: null,
      customerId: null,
      totalFactorQuantity: 0,
      totalFactorDiscount: 0,
      totalFactorPrice: 0,
      factorDescription: "",
      factorResponsibleId: null,
      factorItemCreateViewModels: [
        {
          itemRow: 1,
          productId: null,
          unitId: null,
          quantity: 0,
          productUnitPrice: 0,
          discount: 0,
          inventory: 0,
          description: "",
          totalPrice: 0,
        },
      ],
    },

    validationSchema,

    onSubmit: (values) => {
      handleCreateFactor(values);
    },
  });

  const handleChangeFactorType = async (type) => {
    setLoading(true);
    const formData = {
      factorId: factorId,
      factorType: type,
    };

    if (type === 2) {
      await httpService
        .post("/Factor/ChangeRequestToPreFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code) {
            toast.success("با موفقیت انتقال یافت");
            handleClose();
            getNewList();
          }
        })
        .catch(() => {});
    }
    if (type === 3) {
      await httpService
        .post("/Factor/ChangePreFactorToFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code) {
            toast.success("با موفقیت انتقال یافت");
            handleClose();
            getNewList();
          }
        })
        .catch(() => {});
    }
    if (type === 4) {
      await httpService
        .post("/Factor/ChangeFactorToReturnFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code) {
            toast.success("با موفقیت انتقال یافت");
            handleClose();
            getNewList();
          }
        })
        .catch(() => {});
    }

    setLoading(false);
  };

  const handleGetFactorData = async (id) => {
    setLoading(true);

    await httpService
      .get("/Factor/GetFactorDetail", { params: { factorId: id } })
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          validation.setFieldValue(
            "factorDate",
            res.data?.factorDetailViewModel?.factorDate
          );
          validation.setFieldValue(
            "customerId",
            res.data?.factorDetailViewModel?.customerId
          );
          validation.setFieldValue(
            "factorNumber",
            res.data?.factorDetailViewModel?.factorNumber
          );
          validation.setFieldValue(
            "factorItemCreateViewModels",
            res.data?.factorDetailViewModel?.factorItems
          );
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleDelete = (key) => {
    const newData = validation.values.factorItemCreateViewModels.filter(
      (item) => item.key !== key
    );
    validation.setFieldValue("factorItemCreateViewModels", newData);
    setCount(count - 1);
  };

  const handleAdd = () => {
    const newData = { ...defaultData, itemRow: count + 1, key: count };
    setCount(count + 1);
    validation.setFieldValue("factorItemCreateViewModels", [
      ...validation.values.factorItemCreateViewModels,
      newData,
    ]);
    setCount(count + 1);
  };

  const handleRenderFactorOptions = (type) => {
    if (type === 2) {
      return (
        <Popconfirm
          title="آیا از انتقال این پیش فاکتور به فاکتور اطمینان دارید؟"
          onConfirm={() => handleChangeFactorType(3)}
        >
          <Button type="primary">تبدیل به فاکتور</Button>
        </Popconfirm>
      );
    }
    if (type === 3) {
      return (
        <Popconfirm
          title="آیا از انتقال این فاکتور به مرجوعی اطمینان دارید؟"
          onConfirm={() => handleChangeFactorType(4)}
        >
          <Button type="primary" danger>
            تبدیل به مرجوعی
          </Button>
        </Popconfirm>
      );
    }
    if (type === 4) {
      return (
        <Popconfirm
          title="آیا از انتقال این مرجوعی به فاکتور اطمینان دارید؟"
          onConfirm={() => handleChangeFactorType(3)}
        >
          <Button type="primary" danger>
            تبدیل به فاکتور
          </Button>
        </Popconfirm>
      );
    }
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

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      validation.resetForm();
      setAllFactorPrice(0);
      setAllConditions(null);
    }
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

  const handleCreateFactor = async (values) => {
    setLoading(true);
    const formData = {
      factorNumber: values?.factorNumber,
      factorDate: values?.factorDate,
      customerId: values?.customerId,
      totalFactorQuantity: values?.totalFactorQuantity,
      totalFactorDiscount: values?.totalFactorDiscount,
      totalFactorPrice: values?.totalFactorPrice,
      factorDescription: values?.factorDescription,
      factorResponsibleId: values?.factorResponsibleId,
      factorItemCreateViewModels:
        values?.factorItemCreateViewModels &&
        values?.factorItemCreateViewModels?.length !== 0
          ? values?.factorItemCreateViewModels?.map((item) => {
              return {
                ...item,
              };
            })
          : null,
    };

    if (type === 2) {
      await httpService
        .post("/Factor/CreatePreFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code === 1) {
            toast.success("با موفقیت ساخته شد");
            handleClose();
            getNewList();
          }
        })
        .catch(() => {});
    }
    if (type === 3) {
      await httpService
        .post("/Factor/CreateFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code === 1) {
            toast.success("با موفقیت ساخته شد");
            handleClose();
            getNewList();
          }
        })
        .catch(() => {});
    }
    if (type === 4) {
      await httpService
        .post("/Factor/CreateReturnFactor", formData)
        .then((res) => {
          if (res.status === 200 && res.data?.code === 1) {
            toast.success("با موفقیت ساخته شد");
            handleClose();
            getNewList();
          }
        })
        .catch(() => {});
    }

    setLoading(false);
  };

  const handleGetConditions = async () => {
    setLoading(true);
    const formData = {
      customerId: validation.values.customerId,
      factorType: type,
      factorReceiptAndPaymentConditions: paymentMethod,
      totalFactorQuantity: validation.values.totalFactorQuantity,
      totalFactorPrice: parseInt(allFactorPrice),
    };

    await httpService
      .post("/Factor/GetFactorAdditionsAndDeductions", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          setAllConditions(res.data?.itemAdditionsAndDeductionsList);
          setFormDisabled(false);
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
  const handleGetEmployeesList = async () => {
    let datas = [];

    await httpService
      .get("/Account/GetAllUsers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.data?.map((pr) => {
            datas.push({
              value: pr?.id,
              label: pr?.fullName,
            });
          });
        }
      })
      .catch(() => {});

    setEmployeeList(datas);
  };

  const handleModalTitle = () => {
    if (type == 0) {
      setModalTitle("ثبت درخواست اولیه جدید");
    }
    if (type == 2) {
      setModalTitle("ثبت پیش فاکتور جدید");
    }
    if (type == 3) {
      setModalTitle("ثبت فاکتور جدید");
    }
    if (type == 4) {
      setModalTitle("ثبت فاکتور برگشت از فروش جدید");
    }
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
    row: { index },
    column: { id },
    updateMyData,
    editable,
  }) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef(null);

    const onChange = (e) => {
      setValue(e.target.value);
    };

    const handleProductChange = async (event) => {
      const priceFormData = {
        customerId: customerId,
        productId: event.data?.productId,
        productCategoryId: event.data?.productCategoryId,
        unitId: event.data["productUnitPrices"][0]?.unitId,
        factorType: type,
      };
      const conditionFormData = {
        customerId: customerId,
        productId: event.data?.productId,
        productCategoryId: event.data?.productCategoryId,
        unitId: event.data["productUnitPrices"][0]?.unitId,
        factorType: type,
        quantity: event.data["productUnitPrices"][0]?.stockQuantity,
        totalPrice:
          validation.values.factorItemCreateViewModels[index]["totalPrice"],
      };
      setFormDisabled(true);

      updateMyData(index, "productId", event.data?.productId);
      updateMyData(index, "unitId", event.data["productUnitPrices"][0]?.unitId);
      updateMyData(index, "productCategoryId", event.data?.productCategoryId);
      updateMyData(index, "quantity", 1);
      updateMyData(index, "inventory", event.data?.stockQuantity);
      await httpService
        .post("/Factor/GetFactorItemProductUnitPrice", priceFormData)
        .then((res) => {
          if (res.status === 200 && res.data?.code === 1) {
            updateMyData(index, "productUnitPrice", res.data?.finalPrice);
          }
        })
        .catch(() => {});
      // await httpService
      //   .post("/Factor/GetFactorItemAdditionsAndDeductions", conditionFormData)
      //   .then((res) => {
      //     if (res.status === 200 && res.data?.code === 1) {
      //       // updateMyData(index, "productUnitPrice", res.data?.finalPrice);
      //     }
      //   })
      //   .catch(() => {});
    };

    const handleQuantityChange = (e) => {
      const value = e.target.value;

      updateMyData(index, id, value);
      updateMyData(
        index,
        "totalPrice",
        value *
          validation.values.factorItemCreateViewModels[index][
            "productUnitPrice"
          ]
      );
      validation.setFieldValue(
        "totalFactorPrice",
        validation.values.totalFactorPrice + value
      );
      setFormDisabled(true);
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
        id === "productUnitPrice" ||
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
    if (id === "quantity") {
      return (
        <Input
          type="number"
          min={0}
          className="w-[100px]"
          value={value}
          onChange={handleQuantityChange}
          onBlur={onBlur}
        />
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
                console.log(index);
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

  useEffect(() => {
    handleGetCustomerCode();

    handleGetProductList();
    handleGetProductCatList();
    handleGetCustomerList();
    handleGetUnitList();
    handleGetEmployeesList();
  }, []);

  useEffect(() => {
    if (userData) {
      validation.setFieldValue("factorResponsibleId", userData?.id);
    }
    if (customerId) {
      validation.setFieldValue("customerId", customerId);
    }
  }, [userData, customerId]);

  useEffect(() => {
    handleModalTitle();
  }, [type]);

  useEffect(() => {
    if (factorId) {
      setModalTitle(`ویرایش فاکتور : ${data?.factorNumber}`);
      handleGetFactorData(factorId);
    }
  }, [factorId]);

  // count factor price
  useEffect(() => {
    let prices = 0;

    validation.values.factorItemCreateViewModels.map((value) => {
      prices += value.totalPrice;
    });

    setAllFactorPrice(formatHelper.numberSeperator(prices));
  }, [validation.values.factorItemCreateViewModels]);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        title={modalTitle}
        className="!w-fit max-w-[1200px]"
        footer={
          <div className="flex justify-center gap-3 pt-5">
            {data && handleRenderFactorOptions(type)}
            <Button onClick={handleClose} type="primary" danger>
              لغو
            </Button>
            <Button
              onClick={validation.submitForm}
              type="primary"
              loading={loading}
              disabled={loading || formDisabled}
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

          {!customerId && (
            <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
              <span>شخص :</span>
              <Select
                optionFilterProp="label"
                options={customerList}
                value={validation.values.customerId}
                onChange={(e) => {
                  console.log(e);
                  validation.setFieldValue("customerId", e);
                }}
                className="w-full"
                placeholder="انتخاب کنید..."
              />
              {validation.touched.customerId &&
                validation.errors.customerId && (
                  <span className="text-red-300 text-xs">
                    {validation.errors.customerId}
                  </span>
                )}
            </div>
          )}

          <div className="w-full flex flex-col gap-2 py-5">
            <div className="w-ful flex justify-between">
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
            <div className="w-full overflow-x-scroll">
              {/* <Table
                bordered
                components={components}
                scroll={{ x: "100%" }}
                rowClassName={() => "editable-row"}
                dataSource={validation.values.factorItemCreateViewModels}
                columns={columns}
                pagination={{}}
              /> */}

              <Table
                columns={columns}
                data={validation.values.factorItemCreateViewModels}
                updateMyData={updateMyData}
              />
            </div>
          </div>

          <div className="w-full flex flex-col justify-start items-start pt-10">
            {/* price count */}
            <div className="w-full flex flex-col gap-2 text-lg border-b-[1px] border-b-gray-300 p-3">
              <span className="font-bold">مبلغ کل فاکتور : </span>{" "}
              <div className="w-full text-center">
                <span>{allFactorPrice}</span>
              </div>
            </div>

            {/* conditions */}
            <div className="w-full flex flex-col gap-2 text-lg border-b-[1px] border-b-gray-300 p-3">
              <span className="font-bold">اضافات کسورات : </span>
              <div className="w-full flex flex-col justify-center items-center">
                <Button
                  className="mb-5"
                  type="primary"
                  onClick={handleGetConditions}
                  loading={loading}
                  disabled={loading}
                >
                  محاسبه اضافات کسورات
                </Button>

                <div className="w-full flex flex-col items-center justify-center">
                  {allConditions && allConditions?.length !== 0 ? (
                    allConditions?.map((value, index) => (
                      <div className="flex gap-1 text-md p-1" key={index}>
                        <p className="font-bold">{value?.title} : </p>
                        <span>{value?.amount}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-300">
                      اضافات کسورات محاسبه نشده است...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* payment method */}
            <div className="w-full flex flex-col gap-2 p-3 text-lg border-b-[1px] border-b-gray-300">
              <span className="font-bold">روش پرداخت : </span>
              <div className="w-full flex justify-center items-center">
                <Select
                  className="min-w-[200px]"
                  options={allEnum?.FactorReceiptAndPaymentConditions?.map(
                    (i, index) => {
                      return { label: i, value: index };
                    }
                  )}
                  value={paymentMethod}
                  onChange={(e) => {
                    setPeymantMethod(e);
                  }}
                />
              </div>
            </div>

            {/* description */}
            <div className="flex gap-1 flex-col items-start w-full mx-auto p-3">
              <span className="font-bold text-lg">توضیحات :</span>
              <Input.TextArea
                rows={5}
                value={validation.values.factorDescription}
                name="factorDescription"
                onChange={validation.handleChange}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
                onKeyUp={(e) => console.log(e)}
              />
              {validation.touched.factorDescription &&
                validation.errors.factorDescription && (
                  <span className="text-red-300 text-xs">
                    {validation.errors.factorDescription}
                  </span>
                )}
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
}
