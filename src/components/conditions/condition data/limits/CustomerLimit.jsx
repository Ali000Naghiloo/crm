import { Button, Checkbox, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useHttp from "../../../../hooks/useHttps";

export default function CustomerLimits({ values, setField }) {
  const { httpService } = useHttp();
  const [customerList, setCustomerList] = useState(null);
  const [customerRoleList, setCustomerRoleList] = useState(null);

  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const columns = [
    {
      title: "اشخاص",
      dataIndex: "customers",
      key: "customers",
      render: (value) => {
        return (
          <Select
            className="w-[50%]"
            mode="multiple"
            maxTagCount={1}
            optionFilterProp="label"
            options={customerList}
            value={value}
            onChange={(e) => handleCellChange(`factorCustomer.customers`, e)}
          />
        );
      },
    },
    {
      title: "نقش اشخاص",
      dataIndex: "customerRoles",
      key: "customerRoles",
      render: (value) => {
        return (
          <Select
            options={customerRoleList}
            value={value}
            className="w-[50%]"
            mode="multiple"
            maxTagCount={1}
            onChange={(e) =>
              handleCellChange(`factorCustomer.customerRoles`, e)
            }
            optionFilterProp="label"
          />
        );
      },
    },
    {
      title: "حداقل میزان تکرار خرید",
      dataIndex: "customerPurchaseFrequencyMin",
      key: "customerPurchaseFrequencyMin",
      render: (value) => {
        return (
          <Input
            className="w-[50%]"
            type="number"
            min={0}
            value={value}
            onChange={(e) =>
              handleCellChange(
                `factorCustomer.customerPurchaseFrequencyMin`,
                e.target.value
              )
            }
          />
        );
      },
    },
    {
      title: "حداکثر میزان تکرار خرید",
      dataIndex: "customerPurchaseFrequencyMax",
      key: "customerPurchaseFrequencyMax",
      render: (value, record) => {
        return (
          <Input
            className="w-[50%]"
            type="number"
            min={0}
            value={value}
            onChange={(e) =>
              handleCellChange(
                `factorCustomer.customerPurchaseFrequencyMin`,
                e.target.value
              )
            }
          />
        );
      },
    },
    {
      title: "حداقل میزان خرید شخص از زمان همکاری",
      dataIndex: "customerPurchaseAmountFromTheBeginningOfCooperationMin",
      key: "customerPurchaseAmountFromTheBeginningOfCooperationMin",
      render: (value) => {
        return (
          <Input
            className="w-[50%]"
            type="number"
            min={0}
            value={value}
            onChange={(e) =>
              handleCellChange(
                `factorCustomer.customerPurchaseAmountFromTheBeginningOfCooperationMin`,
                e.target.value
              )
            }
          />
        );
      },
    },
    {
      title: "حداکثر میزان خرید شخص از زمان همکاری",
      dataIndex: "customerPurchaseAmountFromTheBeginningOfCooperationMax",
      key: "customerPurchaseAmountFromTheBeginningOfCooperationMax",
      render: (value, record) => (
        <Input
          className="w-[50%]"
          type="number"
          min={0}
          value={value}
          onChange={(e) =>
            handleCellChange(
              `factorCustomer.customerPurchaseAmountFromTheBeginningOfCooperationMax`,
              e.target.value
            )
          }
        />
      ),
    },
    {
      title: "همه اشخاص بجز",
      dataIndex: "allCustomersExcept",
      key: "allCustomersExcept",
      render: (value) => (
        <Checkbox
          checked={value}
          onChange={(e) => {
            handleCellChange(
              `factorCustomer.allCustomersExcept`,
              e.target.checked
            );
          }}
        />
      ),
    },
    {
      title: "در تاریخ تولد شخص اعمال شود",
      dataIndex: "customerBirthday",
      key: "customerBirthday",
      render: (value) => (
        <Checkbox
          checked={value}
          onChange={(e) => {
            handleCellChange(
              `factorCustomer.customerBirthday`,
              e.target.checked
            );
          }}
        />
      ),
    },
    {
      title: "جنسیت شخص",
      dataIndex: "customerSex",
      key: "customerSex",
      render: (value) => (
        <div>
          <Select
            options={allEnum?.CustomerSex?.map((ty, index) => {
              return { label: ty, value: index };
            })}
            value={value}
            onChange={(e) => handleCellChange(`factorCustomer.customerSex`, e)}
          />
        </div>
      ),
    },
    {
      title: "توضیحات",
      dataIndex: "description",
      key: "description",
      render: (value) => {
        return (
          <div>
            <Input
              defaultChecked={value}
              value={value}
              onChange={(e) =>
                handleCellChange(`factorCustomer.description`, e.target.value)
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

  const handleGetCustomersList = async () => {
    let datas = [];
    setCustomerList(null);

    await httpService
      .get("/Customer/GetAllCustomers")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          res.data?.customerList?.map((cu) => {
            datas.push({ label: cu.customerName, value: cu.customerId });
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

  useEffect(() => {
    handleGetCustomersList();
    handleGetCustomerRoleList();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto flex flex-wrap gap-3">
        {columns.map((col, index) => {
          return (
            <div
              key={col.key}
              className="flex gap-3 items-center min-w-[300px] md:min-w-[460px] mx-auto"
            >
              <span className="font-bold w-[50%]">{col.title} : </span>
              {col.render(values[`${col.dataIndex}`])}
            </div>
          );
        })}
      </div>
    </div>
  );
}
