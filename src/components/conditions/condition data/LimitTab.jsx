import { useEffect, useState } from "react";
import useHttp from "../../../hooks/useHttps";
import { Button, Popconfirm, Spin } from "antd";
import { useFormik } from "formik";
import CreateLimit from "./limits/CreateLimit";
import CreateLimitModal from "./limits/CreateLimitModal";
import { MdDelete } from "react-icons/md";

export default function LimitTab({ data }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(true);
  const [limitList, setLimitList] = useState(null);
  const [selectedLimit, setSelectedLimit] = useState(null);

  const [createModal, setCreateModal] = useState({
    open: false,
    id: null,
  });

  const handleGetLimitList = async () => {
    setLoading(true);
    const formData = {
      factorAdditionsAndDeductionsId: data?.additionsAndDeductionsId,
    };

    await httpService
      .get(
        "/AdditionsAndDeductionsAllCondition/AdditionsAndDeductionAllConditions",
        { params: formData }
      )
      .then((res) => {
        if (res.status === 200 && res.data?.code == 1) {
          setLimitList(
            res.data?.additionsAndDeductionsAllConditionsViewModelList
          );
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleShowCreateModal = () => {
    setCreateModal({
      open: true,
      id: data?.additionsAndDeductionsId,
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const formData = {
      additionsAndDeductionsAllConditionsId: id,
    };

    await httpService(
      "/AdditionsAndDeductionsAllCondition/DeleteAdditionsAndDeductionAllConditions",
      { params: formData }
    )
      .then((res) => {})
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    handleGetLimitList();
  }, [data]);

  return (
    <>
      <div className="w-full flex flex-col gap-10">
        <div className="w-full">
          <Button
            onClick={handleShowCreateModal}
            className="w-full"
            type="primary"
          >
            تعریف شرط جدید
          </Button>
        </div>

        {/* condition limits */}
        <div className="w-full flex flex-col items-center overflow-y-auto max-h-[150px]">
          {!loading ? (
            limitList && limitList?.length !== 0 ? (
              limitList.map((limit) => (
                <div
                  key={limit?.additionsAndDeductionsAllConditionsId}
                  className={`w-full flex gap-3 border-b cursor-pointer p-2 ${
                    selectedLimit ===
                    limit?.additionsAndDeductionsAllConditionsId
                      ? "bg-gray-300"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedLimit(
                      limit?.additionsAndDeductionsAllConditionsId
                    )
                  }
                >
                  <div>{limit?.priority}. </div>
                  <div className="flex">
                    <span>{limit?.condition?.conditionTitle}</span>
                  </div>
                  <div className="mr-auto">
                    <Popconfirm
                      title="آیا از حذف این شرط برای اضافه کسری مطمئن هستید؟"
                      onConfirm={() => {
                        handleDelete(
                          limit?.additionsAndDeductionsAllConditionsId
                        );
                      }}
                    >
                      <Button danger type="primary" className="p-1">
                        <MdDelete />
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full flex justify-center items-center">
                <span>شرطی برای این اضافه کسری تعیین نشده</span>
              </div>
            )
          ) : (
            <Spin></Spin>
          )}
        </div>

        {selectedLimit && <CreateLimit limitId={selectedLimit} />}
        {createModal.open && (
          <CreateLimitModal
            open={createModal.open}
            setOpen={(e) => {
              setCreateModal({ open: e });
            }}
            conditionId={data?.additionsAndDeductionsId}
          />
        )}
      </div>
    </>
  );
}
