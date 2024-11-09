import { Button, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import useHttp from "../../../hooks/useHttps";
import { useFormik } from "formik";
import SelectItems from "./SelectItems";
import moment from "jalali-moment";
import * as yup from "yup";
import MyDatePicker from "../../../common/MyDatePicker";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function CreateRequestProduct({
  open,
  setOpen,
  id,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [customerList, setCustomerList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemRow, setItemRow] = useState(1);

  const userData = useSelector((state) => state.userData.userData);
  const validationSchema = yup.object().shape({});

  const validation = useFormik({
    initialValues: {
      factorId: null,
      factorNumber: 0,
      factorDate: moment().utc().locale("fa"),
      customerId: null,
      totalFactorQuantity: 0,
      factorDescription: "",
      factorResponsibleId: userData ? userData.id : "",
      factorItemCreateViewModels: [
        {
          itemRow: itemRow,
          productId: null,
          productCategoryId: null,
          unitId: null,
          quantity: null,
          factorItemResponsibleId: null,
          description: "",
        },
      ],
    },

    validationSchema,

    onSubmit: (values) => {
      if (!id) {
        handleCreate(values);
      } else {
        handleEdit(values);
      }
    },
  });

  const handleCreate = async (values) => {
    setLoading(true);
    const formData = { ...values };

    await httpService
      .post("/Factor/CreateRequest", formData)
      .then((res) => {
        if (res.status == 200 && res.data.code == 1) {
          toast.success("با موفقیت ثبت شد");
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
      factorItemCreateViewModels: null,
      factorItemEditViewModels: values?.factorItemCreateViewModels,
    };

    await httpService
      .post("/Factor/EditRequest", formData)
      .then((res) => {
        if (res.status == 200 && res.data.code == 1) {
          toast.success("با موفقیت ثبت شد");
          handleClose();
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleGetDetails = async () => {
    setLoading(true);
    const formData = { factorId: id };

    await httpService
      .get("/Factor/GetFactorDetail", { params: formData })
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          const datas = res.data?.factorDetailViewModel;
          validation.setValues({
            factorId: datas?.factorId,
            customerId: datas?.customerId,
            factorDate: datas?.factorDate,
            factorNumber: datas.factorNumber,
            factorResponsibleId: datas?.factorItemResponsibleId,
            factorItemCreateViewModels: datas?.factorItems,
          });
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGetFactorCod = async () => {
    setLoading(true);

    await httpService
      .get("/Factor/FactorCod")
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          validation.setFieldValue("factorNumber", res.data?.factorNumber);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  // get lists
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

  useEffect(() => {
    if (open) {
      handleGetFactorCod();
      handleGetCustomerList();
    }
  }, [open]);

  useEffect(() => {
    if (id) {
      handleGetDetails();
    }
  }, [id]);

  return (
    <Modal
      open={open}
      loading={loading}
      onCancel={handleClose}
      title={id ? "ویرایش درخواست کالا" : "ثبت درخواست کالا جدید"}
      footer={
        <div className="w-full flex justify-end gap-5">
          <Button type="primary" danger>
            لغو
          </Button>
          <Button onClick={validation.submitForm} type="primary">
            ثبت
          </Button>
        </div>
      }
      className="w-full lg:min-w-[980px] mx-auto"
    >
      <div className="w-full flex flex-wrap gap-5 my-5">
        <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
          <span>تاریخ </span>
          <MyDatePicker
            value={validation.values.factorDate}
            name="factorDate"
            setValue={(e) => validation.setFieldValue("factorDate", e)}
            className={"w-[300px]"}
            placeholder="لطفا اینجا وارد کنید..."
          />
          {validation.touched.factorDate && validation.errors.factorDate && (
            <span className="text-error text-xs">
              {validation.errors.factorDate}
            </span>
          )}
        </div>

        <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
          <span>شخص </span>
          <Select
            loading={customerList ? false : true}
            value={validation.values.customerId}
            name="customerId"
            options={customerList}
            onChange={(e) => validation.setFieldValue("customerId", e)}
            className="w-[100%]"
            placeholder="لطفا اینجا وارد کنید..."
          />
          {validation.touched.customerId && validation.errors.customerId && (
            <span className="text-error text-xs">
              {validation.errors.customerId}
            </span>
          )}
        </div>

        {validation.values.customerId && (
          <SelectItems validation={validation} factorType={1} />
        )}
      </div>
    </Modal>
  );
}
