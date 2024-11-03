import { Button, Popconfirm, Select, Table } from "antd";
import useHttp from "../../../hooks/useHttps";
import { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import { HiRefresh } from "react-icons/hi";

export default function UnitTab({ unit, setUnit }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [unitList, setUnitList] = useState(false);

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

  useEffect(() => {
    handleGetUnitList();
  }, []);

  return (
    <Suspense>
      <div className="flex flex-wrap gap-5">
        <div className="w-[300px] overflow-x-auto">
          <span>واحد</span>
          <Select
            fieldNames={{ label: "unitName", value: "unitId" }}
            options={unitList}
            loading={unitList ? false : true}
            value={unit}
            onChange={(e) => {
              setUnit(e);
            }}
            className="w-[100%]"
            placeholder="لطفا اینجا وارد کنید..."
          />
        </div>
      </div>
    </Suspense>
  );
}
