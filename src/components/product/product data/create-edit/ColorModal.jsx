import {
  Button,
  ColorPicker,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Spin,
} from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import useHttp from "../../../../hooks/useHttps";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BiUpload } from "react-icons/bi";
import formatHelper from "../../../../helper/formatHelper";
import { MdDelete } from "react-icons/md";

export default function SizeModal({
  open,
  setOpen,
  mode,
  data,
  productId,
  getNewList,
}) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  // const allEnum = useSelector((state) => state.allEnum.allEnum);

  const validationSchema = yup.object().shape({
    colorName: yup.string().required("لطفا این فیلد را پر کنید"),
    hexValue: yup.string().required("لطفا این فیلد را پر کنید"),
  });

  const validation = useFormik({
    initialValues: {
      colorName: "",
      hexValue: null,
      productId: null,
      productColorImageAttachmentIds: [],
    },
    validationSchema,

    onSubmit: (values) => {
      if (mode === "create") {
        handleCreate(values);
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
      productId: values?.productId,
      colorName: values?.colorName,
      hexValue: values?.hexValue,
      productColorImageAttachmentIds: values?.productColorImageAttachmentIds,
    };

    await httpService
      .post("/ProductColor/CreateProductColor", formData)
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

  const handleDeleteImage = async (url) => {
    validation.setFieldValue(
      "productColorImageAttachmentIds",
      validation.values.productColorImageAttachmentIds?.filter(
        (img) => img !== url
      )
    );
    setFiles((old) => {
      return old.filter((img) => img?.filePath !== url);
    });
  };

  useEffect(() => {
    if (mode === "create" && productId) {
      validation.setFieldValue("productId", productId);
    }
  }, [productId]);

  return (
    <div>
      <Modal
        open={open}
        onCancel={handleClose}
        title={<>تعریف رنگ برای محصول</>}
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
          <div className="flex gap-1 flex-col items-start w-[420px] mx-auto">
            <span>نام رنگ :</span>
            <Input
              value={validation.values.colorName}
              name="colorName"
              onChange={validation.handleChange}
              className="w-[100%]"
              placeholder="لطفا اینجا وارد کنید..."
            />
            {validation.touched.colorName && validation.errors.colorName && (
              <span className="text-red-300 text-xs">
                {validation.errors.colorName}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1 justify-center items-center w-[420px] mx-auto py-5">
              <span>انتخاب رنگ :</span>
              <ColorPicker
                allowClear
                trigger="hover"
                value={validation.values.hexValue}
                name="hexValue"
                onChange={(e, event) => {
                  validation.setFieldValue("hexValue", event);
                  console.log(event);
                }}
                format="hex"
                showText
                placeholder="لطفا اینجا وارد کنید..."
              />
            </div>
            {validation.touched.hexValue && validation.errors.hexValue && (
              <span className="text-red-300 text-xs">
                {validation.errors.hexValue}
              </span>
            )}
          </div>

          {/* upload */}
          <div className="w-full flex justify-center items-center">
            <label
              className="w-fit"
              onChange={async (file) => {
                setLoading(true);
                const formData = new FormData();
                formData.append("file", file.target.files[0]);

                if (file.target.files[0]?.type?.includes("image")) {
                  await httpService
                    .post("/Attachment/CreateAttachment", formData, {
                      params: {
                        productColorId: data?.productColorId,
                        productId: data?.productId,
                        entityType: 3,
                      },
                    })
                    .then((res) => {
                      if (res.status == 200 && res.data?.code) {
                        validation.setFieldValue(
                          "productColorImageAttachmentIds",
                          [
                            ...validation.values.productColorImageAttachmentIds,
                            res.data?.data?.id,
                          ]
                        );
                        setFiles([
                          ...files,
                          {
                            filePath: res.data?.data?.filePath,
                            fileName: res.data?.data?.fileName,
                          },
                        ]);
                        getNewList();
                      }
                    })
                    .catch(() => {});
                } else {
                  toast.warn("لطفا فقط از عکس استفاده کنید");
                  setLoading(false);
                }

                setLoading(false);
              }}
            >
              <div
                className={`${
                  loading ? "opacity-50" : ""
                } flex items-center gap-2 mx-auto text-lg rounded-md my-4 cursor-pointer bg-loginForm text-white p-3 py-2`}
              >
                <span>بارگذاری</span> {loading ? <Spin></Spin> : <BiUpload />}
              </div>
              <Input
                hidden={true}
                type="file"
                disabled={loading}
                className="!hidden"
                accept="image/png, image/gif, image/jpeg"
              />
            </label>
          </div>

          {files && files?.length !== 0 ? (
            <div className="w-full flex flex-col gap-3 pt-10">
              <i className="font-bold">موارد اپلود شده</i>

              <div className="w-full flex flex-wrap justify-evenly gap-3">
                {files?.map((img) => (
                  <div
                    className="w-[120px] flex flex-col items-center gap-1"
                    key={img?.filePath}
                  >
                    <span>{formatHelper.cutString(img?.fileName, 0, 10)}</span>
                    <Image
                      src={img?.filePath}
                      alt="رنگ"
                      className="w-full h-fit"
                    />
                    <div className="w-full">
                      <Button
                        size="small"
                        className="w-full"
                        danger
                        type="primary"
                        onClick={() => handleDeleteImage(img?.filePath)}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

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
