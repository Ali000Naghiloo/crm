import { Button, Input, Popconfirm, Select, Table } from "antd";
import useHttp from "../../../hooks/useHttps";
import { Suspense, useEffect, useState } from "react";

export default function UnitTab({
  unit,
  setUnit,
  quantity,
  setQuantity,
  // for having the value in parent
  setUnitData,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [unitList, setUnitList] = useState(false);
  const [parent, setParent] = useState(null);

  // const UnitModal = lazy(() => import("./create-edit/UnitModal"));

  const handleGetUnitList = async () => {
    await httpService
      .get("/Unit/Units")
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1)
          setUnitList(res.data.unitViewModelList);
      })
      .catch(() => {});
  };

  const handleGetParentUnitList = async () => {
    await httpService
      .get("/Unit/Units")
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1)
          setUnitList(res.data.unitViewModelList);
      })
      .catch(() => {});
  };

  useEffect(() => {
    handleGetUnitList();
  }, []);

  useEffect(() => {
    if (!unit) {
      setParent(null);
    }
  }, [unit]);

  useEffect(() => {
    if (unit && unitList) {
      const selectedUnitData = unitList?.filter(
        (u) => u.unitId === unit && u.unitType == 2
      );
      setParent(selectedUnitData[0]);
    }
  }, [unit]);

  useEffect(() => {
    if (unit && unitList) {
      const selectedUnitData = unitList?.filter((u) => u.unitId === unit);

      setUnitData(selectedUnitData[0]);
    }
  }, [unit, unitList]);

  return (
    <Suspense>
      <div className="w-full flex justify-center flex-wrap gap-5 mx-auto">
        <div className="w-[300px] overflow-x-auto">
          <span>واحد</span>
          <Select
            fieldNames={{ label: "unitName", value: "unitId" }}
            options={unitList}
            loading={unitList ? false : true}
            value={unit}
            onChange={(e, event) => {
              if (event?.unitType == 2) {
                setParent(event);
              } else {
                setParent(null);
              }
              setUnit(e);
            }}
            className="w-[100%]"
            placeholder="لطفا اینجا وارد کنید..."
          />
        </div>

        {parent && (
          <div className="w-[300px] overflow-x-auto">
            <span>
              {parent?.parentUnit} در {parent?.unitName}
            </span>
            <Input
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
          </div>
        )}
      </div>
    </Suspense>
  );
}
