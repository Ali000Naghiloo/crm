import { Checkbox } from "antd";
import { useState } from "react";

export default function Task({ data }) {
  const [loading, setLoading] = useState(false);

  const handleChangeTaskStatus = async () => {};

  return (
    <>
      <div className="w-full flex flex-col gap-3 max-h-[275px] bg-[#e6e8ec] p-2 rounded-md">
        <div className="flex gap-2">
          <Checkbox
            checked={data?.doneStatus}
            onClick={handleChangeTaskStatus}
          />
          <span className="text-lg">{data?.name}</span>
        </div>

        <div className="w-full">{data?.description}</div>
      </div>
    </>
  );
}
