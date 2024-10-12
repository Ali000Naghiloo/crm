import { Button, Form, Input, Modal, Select } from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Map from "../../../../common/Map";
import { cities, provinces } from "../../../../hooks/functions";
import { FaLocationPin } from "react-icons/fa6";

export default function AddressModal({
  open,
  setOpen,
  mode,
  data,
  customerId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    priority: yup.number().required("این فیلد را پر کنید"),
    // addressName: yup.string().required("این فیلد را پر کنید"),
    country: yup.string().required("این فیلد را پر کنید"),
    province: yup.string().required("این فیلد را پر کنید"),
    city: yup.string().required("این فیلد را پر کنید"),
    // address: yup.string().required("این فیلد را پر کنید"),
    // postalCode: yup.string().required("این فیلد را پر کنید"),
    lat: 0,
    lng: 0,
    // description: yup.string().required("این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      customerId: 0,
      customerConnectorId: 0,
      addressName: "",
      priority: 0,
      country: "ایران",
      province: "",
      city: "",
      address: "",
      postalCode: "",
      lat: 36,
      lng: 51,
      description: "",
    },

    validationSchema,

    onSubmit: (values) => {
      if (mode === "create") {
        handleCreate(values);
      }
      if (mode === "edit") {
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
      customerId: values.customerId,
      customerConnectorId: values.customerConnectorId,
      priority: values.priority,
      addressName: values.addressName,
      country: values.country,
      province: values.province,
      city: values.city,
      address: values.address,
      postalCode: values.postalCode,
      lat: values.lat,
      lng: values.lng,
      description: values.description,
    };

    await httpService
      .post("/Address/CreateAddress", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ایجاد شد");
        }
      })
      .catch(() => {});

    handleClose();
    getNewList();
    setLoading(false);
  };

  const handleSetCurrentLocation = async () => {
    if (navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((e) => {
        if (e.state === "granted") {
          navigator.geolocation.getCurrentPosition(success, error);

          function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            if (latitude) {
              validation.setFieldValue("lat", latitude);
            }
            if (longitude) {
              validation.setFieldValue("lng", longitude);
            }
          }

          function error() {
            toast.warn("لطفا دسترسی مکان را بررسی کنید");
            navigator.geolocation.getCurrentPosition(handleSetCurrentLocation);
          }
        } else {
          toast.warn("لطفا دسترسی موقعیت مکانی بدهید");
          navigator.geolocation.getCurrentPosition(handleSetCurrentLocation);
        }
      });
    }
  };

  const handleEdit = async (values) => {
    setLoading(true);
    const formData = {
      customerId: values.customerId,
      customerConnectorId: values.customerConnectorId,
      priority: values.priority,
      addressName: values.addressName,
      country: values.country,
      province: values.province,
      city: values.city,
      address: values.address,
      postalCode: values.postalCode,
      lat: values.lat,
      lng: values.lng,
      description: values.description,
    };

    await httpService
      .post("/Address/EditAddress", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          toast.success("با موفقیت ویرایش شد");
        }
      })
      .catch(() => {});

    handleClose();
    getNewList();
    setLoading(false);
  };

  useEffect(() => {
    if (mode === "edit" && data) {
      validation.setFieldValue("customerId", customerId);
      validation.setFieldValue("customerConnectorId", data.customerConnectorId);
      validation.setFieldValue("priority", data.priority);
      validation.setFieldValue("addressName", data.addressName);
      validation.setFieldValue("country", data.country);
      validation.setFieldValue("province", data.province);
      validation.setFieldValue("province", data.province);
      validation.setFieldValue("city", data.city);
      validation.setFieldValue("address", data.address);
      validation.setFieldValue("postalCode", data.postalCode);
      validation.setFieldValue("lat", data.lat);
      validation.setFieldValue("lng", data.lng);
      validation.setFieldValue("description", data.description);
    }

    if (mode === "create" && customerId) {
      validation.setFieldValue("customerId", customerId);
    }

    console.log(customerId);
  }, [data, customerId]);

  return (
    <div>
      <Modal
        className="lg:min-w-[900px]"
        open={open}
        onCancel={handleClose}
        title={
          mode === "create" ? (
            <>ساخت آدرس برای شخص</>
          ) : (
            <>{`ویرایش آدرس "${data?.addressName}"`}</>
          )
        }
        footer={
          <div className="">
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
          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>نام آدرس :</span>
            <Input
              value={validation.values.addressName}
              name="addressName"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.addressName &&
              validation.errors.addressName && (
                <span className="text-red-300 text-xs">
                  {validation.errors.addressName}
                </span>
              )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>اولویت (عدد بالاتر , اولویت پایین تر) :</span>
            <Input
              type="number"
              value={validation.values.priority}
              name="priority"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.priority && validation.errors.priority && (
              <span className="text-red-300 text-xs">
                {validation.errors.priority}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>استان :</span>
            <Select
              options={provinces.map((pr) => {
                return { label: pr, value: pr };
              })}
              showSearch
              value={validation.values.province}
              onChange={(e) => {
                validation.setFieldValue("province", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.province && validation.errors.province && (
              <span className="text-red-300 text-xs">
                {validation.errors.province}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[300px] mx-auto">
            <span>شهر :</span>
            <Select
              options={
                validation.values.province.length !== 0 &&
                cities[validation.values.province]
                  ? cities[validation.values.province].map((city) => {
                      return { label: city, value: city };
                    })
                  : []
              }
              value={validation.values.city}
              onChange={(e) => {
                validation.setFieldValue("city", e);
              }}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.city && validation.errors.city && (
              <span className="text-red-300 text-xs">
                {validation.errors.city}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[100%] mx-auto">
            <span>آدرس :</span>
            <Input
              value={validation.values.address}
              name="address"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.address && validation.errors.address && (
              <span className="text-red-300 text-xs">
                {validation.errors.address}
              </span>
            )}
          </div>

          <div className="flex gap-2 flex-col items-start w-[100%] mx-auto">
            <span>موقعیت بر روی نقشه :</span>
            <div className="w-full flex flex-col">
              <Map
                position={[validation.values.lat, validation.values.lng]}
                setPosition={(e) => {
                  validation.setFieldValue("lat", e[0]);
                  validation.setFieldValue("lng", e[1]);
                }}
              />
              {validation.touched.lat && validation.errors.lat && (
                <span className="text-red-300 text-xs">
                  {validation.errors.lat}
                </span>
              )}
            </div>

            <Button
              className="w-full"
              type="primary"
              onClick={handleSetCurrentLocation}
            >
              انتخاب لوکیشن من <FaLocationPin />
            </Button>
          </div>

          <div className="flex gap-1 flex-col items-start w-[100%] mx-auto">
            <span>کد پستی :</span>
            <Input
              value={validation.values.postalCode}
              name="postalCode"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.postalCode && validation.errors.postalCode && (
              <span className="text-red-300 text-xs">
                {validation.errors.postalCode}
              </span>
            )}
          </div>

          <div className="flex gap-1 flex-col items-start w-[100%] mx-auto">
            <span>توضیحات :</span>
            <Input
              value={validation.values.description}
              name="description"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.description &&
              validation.errors.description && (
                <span className="text-red-300 text-xs">
                  {validation.errors.description}
                </span>
              )}
          </div>

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
