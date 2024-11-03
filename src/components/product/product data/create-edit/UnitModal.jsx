import { Button, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UnitModal({
  open,
  setOpen,
  data,
  productId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [unitList, setUnitList] = useState(null);
  const allEnum = useSelector((state) => state.allEnum.allEnum);
  // for having the selected unit data localy
  const [selectedUnit, setSelectedUnit] = useState({
    label: "",
    type: 0,
    parent: "",
  });

  const validationSchema = yup.object().shape({
    unitId: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      product: "",
      unit: "",
      productId: null,
      unitId: null,
      quantityInUnit: 1, // needed if other options is selected
    },

    validationSchema,

    onSubmit: (values) => {
      if (!data) {
        handleCreate(values);
      } else {
        handleEdit(values);
      }
    },
  });

  const handleClose = () => {
    setOpen(false);
    validation.resetForm();
  };

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
      productId: productId,
    };

    await httpService
      .post("/ProductUnit/CreateProductUnit", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ایجاد شد");
          handleClose();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      ...values,
      unitId: data,
      productId: productId,
    };

    await httpService
      .post("/ProductUnit/EditProductUnit", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ایجاد شد");
          handleClose();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleGetUnitList = async () => {
    setLoading(true);
    const datas = [];

    await httpService
      .get("/Unit/Units")
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          res.data?.unitViewModelList?.map((un) => {
            datas.push({ label: un?.unitName, value: un?.unitId, data: un });
          });
        }
      })
      .catch(() => {});

    setUnitList(datas);
    setLoading(false);
  };

  useEffect(() => {
    if (productId) {
      validation.setFieldValue("productId", productId);
    }
  }, [productId]);

  useEffect(() => {
    handleGetUnitList();
  }, []);

  return (
    <div>
      <Modal
        centered
        open={open}
        onCancel={handleClose}
        title={data ? `ویرایش واحد کالا` : "تعریف واحد برای کالا"}
        footer={
          <div>
            <Button type="primary" danger onClick={handleClose}>
              لغو
            </Button>
          </div>
        }
      >
        <Form
          onFinish={validation.handleSubmit}
          className="w-full flex flex-wrap gap-3 pt-4"
        >
          {/* <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
            <span>عنوان واحد :</span>
            <Input
              min={0}
              value={validation.values.unit}
              name="unit"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.unit && validation.errors.unit && (
              <span className="text-red-300 text-xs">
                {validation.errors.unit}
              </span>
            )}
          </div> */}

          <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
            <span>واحد :</span>
            <Select
              options={unitList}
              value={validation.values.unitId}
              name="unitId"
              onChange={(e, event) => {
                const v = event.data;
                setSelectedUnit({
                  label: v.unitName,
                  type: v.unitType,
                  parent: v.parentUnit,
                });
                validation.setFieldValue("quantityInUnit", 1);
                validation.setFieldValue("unitId", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.unitId && validation.errors.unitId && (
              <span className="text-red-300 text-xs">
                {validation.errors.unitId}
              </span>
            )}
          </div>

          {selectedUnit.type == 2 && (
            <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
              <span>
                {selectedUnit.parent} در هر {selectedUnit.label} :
              </span>
              <Input
                type="number"
                min={0}
                value={validation.values.quantityInUnit}
                name="quantityInUnit"
                onChange={validation.handleChange}
                className="w-[100%]"
                placeholder="لطفا اینجا وارد کنید..."
              />
              {validation.touched.quantityInUnit &&
                validation.errors.quantityInUnit && (
                  <span className="text-red-300 text-xs">
                    {validation.errors.quantityInUnit}
                  </span>
                )}
            </div>
          )}

          {/* submit button */}
          <div className="w-full flex justify-center py-10">
            <Button
              type="primary"
              loading={loading}
              disabled={loading}
              htmlType="submit"
            >
              ثبت
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
