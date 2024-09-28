import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import useHttp from "../../../hooks/useHttps";
import MyDatePicker from "../../../common/MyDatePicker";
import { toast } from "react-toastify";

export default function CreateWarehouseModal({ open, setOpen, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [warehouseCode, setWarehouseCode] = useState(null);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    warehouseName: yup.string().required("این فیلد را پر کنید"),
    capacity: yup.number().required("این فیلد را پر کنید"),
    warehouseType: yup.string().required("این فیلد را پر کنید"),
    establishedDate: yup.string().required("این فیلد را پر کنید"),
    warehouseStatus: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      warehouseName: "",
      warehouseCode: "",
      warehouseManualCode: "",
      capacity: 0,
      isActive: true,
      warehouseType: 0,
      establishedDate: null,
      warehouseStatus: 0,
    },

    validationSchema,

    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const handleClose = () => {
    if (!loading) {
      validation.resetForm();
      setOpen(false);
    }
  };

  const handleGetWarehouseCode = async () => {
    await httpService
      .get("/Warehouse/WarehouseCod")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          setWarehouseCode(res.data?.warehouseCod);
        }
      })
      .catch(() => {
        return null;
      });
  };

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      warehouseName: values?.warehouseName,
      warehouseCode: warehouseCode,
      warehouseManualCode: values?.warehouseManualCode,
      capacity: values?.capacity,
      isActive: true,
      warehouseType: values?.warehouseType,
      establishedDate: values?.establishedDate,
      warehouseStatus: values?.warehouseStatus,
    };

    await httpService
      .post("/Warehouse/CreateWarehouse", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("انبار با موفقیت ساخته شد");
          handleClose();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    handleGetWarehouseCode();
  }, []);

  return (
    <>
      <Modal
        open={open}
        onCancel={handleClose}
        title="ساخت انبار جدید"
        className="!w-fit max-w-[1000px]"
        footer={
          <div className="flex justify-end gap-3 pt-5">
            <Button onClick={handleClose} type="primary" danger>
              لغو
            </Button>
            <Button
              onClick={validation.handleSubmit}
              type="primary"
              loading={loading}
              disabled={loading}
            >
              ثبت انبار جدید
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-4"
        >
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نام انبار</span>
            <Input
              value={validation.values.warehouseName}
              name="warehouseName"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.warehouseName &&
              validation.errors.warehouseName && (
                <span className="text-red-300 text-xs">
                  {validation.errors.warehouseName}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نوع انبار</span>
            <Select
              options={allEnum?.WarehouseType?.map((type, index) => {
                return { label: type, value: index };
              })}
              value={validation.values.warehouseType}
              onChange={(e) => {
                validation.setFieldValue("warehouseType", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.warehouseType &&
              validation.errors.warehouseType && (
                <span className="text-red-300 text-xs">
                  {validation.errors.warehouseType}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>تاریخ تاسیس :</span>
            <MyDatePicker
              value={validation.values.establishedDate}
              setValue={(e) => {
                validation.setFieldValue("establishedDate", e);
              }}
              className={"w-[300px]"}
              status={
                validation.touched.establishedDate &&
                validation.errors.establishedDate &&
                "error"
              }
            />
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>کد انبار :</span>
            <Input
              value={validation.values.warehouseManualCode}
              name="warehouseManualCode"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.warehouseManualCode &&
              validation.errors.warehouseManualCode && (
                <span className="text-red-300 text-xs">
                  {validation.errors.warehouseManualCode}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>وضعیت انبار :</span>
            <Select
              options={allEnum?.WarehouseStatus?.map((type, index) => {
                return { label: type, value: index };
              })}
              value={validation.values.warehouseStatus}
              onChange={(e) => {
                validation.setFieldValue("warehouseStatus", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.warehouseStatus &&
              validation.errors.warehouseStatus && (
                <span className="text-red-300 text-xs">
                  {validation.errors.warehouseStatus}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>ظرفیت :</span>
            <Input
              type="number"
              value={validation.values.capacity}
              name="capacity"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.capacity && validation.errors.capacity && (
              <span className="text-red-300 text-xs">
                {validation.errors.capacity}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 w-full mx-auto">
            <span className="text-nowrap">فعال است؟</span>
            <Checkbox
              checked={validation.values.isActive}
              name="isActive"
              onChange={validation.handleChange}
              className="w-full"
            />
            {validation.touched.isActive && validation.errors.isActive && (
              <span className="text-red-300 text-xs">
                {validation.errors.isActive}
              </span>
            )}
          </div>
        </Form>
      </Modal>
    </>
  );
}