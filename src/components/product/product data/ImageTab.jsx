import { Button, Image, Input, Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import useHttp, { baseURL } from "../../../hooks/useHttps";
import { TiPlusOutline } from "react-icons/ti";
import { BiDownload, BiUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import formatHelper from "../../../helper/formatHelper";

export default function ImageTab({ data }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  // file list
  const [fileList, setFileList] = useState(null);
  const [file, setFile] = useState(null);
  // preview settings
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [imageNum, setImageNum] = useState(0);

  const handleDelete = async (id) => {
    setLoading(true);

    await httpService
      .get("/ProductImage/DeleteProductImage", {
        params: { productImageId: id },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code) {
          toast.success("با موفقیت حذف شد");
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleRenderFiles = () => {
    return (
      <div className="w-full flex flex-col gap-10">
        <div className="w-full flex flex-col gap-2">
          <i>عکس ها</i>
          <div className="w-full flex gap-2 flex-wrap">
            {fileList
              ? fileList.map(
                  (file, index) =>
                    file?.productImageAttachments[0]?.fileType?.includes(
                      "image"
                    ) && (
                      <div key={index} className="w-fit flex flex-col gap-1">
                        <span>
                          {formatHelper.cutString(
                            file?.productImageAttachments[0]?.fileName,
                            0,
                            10
                          )}
                        </span>
                        <div className="w-20 h-20 flex justify-center items-center rounded-md border-gray-100 border-2 overflow-hidden">
                          <Image
                            width={"100%"}
                            height={"100%"}
                            src={file?.productImageAttachments[0]?.filePath}
                            loading="lazy"
                            className="w-full h-full !rounded-md"
                            fallback={
                              "https://archive.org/download/placeholder-image/placeholder-image.jpg"
                            }
                            alt={file.name}
                          />
                        </div>

                        <Button
                          onClick={() => handleDelete(file.productImageId)}
                          disabled={loading}
                          loading={loading}
                          size="small"
                          danger
                          type=""
                        >
                          <MdDelete />
                        </Button>
                      </div>
                    )
                )
              : null}
          </div>
        </div>
      </div>
    );
  };

  const getNewList = async () => {
    setLoading(true);

    await httpService
      .get("/ProductImage/ProductImages", {
        params: {
          productId: data?.productId,
        },
      })
      .then((res) => {
        if (res.status === 200 && res.data?.code) {
          setFileList(res.data?.productImageViewModelList);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleSaveProductImage = async (imageId) => {
    setLoading(true);
    const formData = {
      priority: imageNum,
      productId: data?.productId,
      productImageAttachments: [imageId],
    };

    await httpService
      .post("/ProductImage/CreateProductImage", formData, {
        params: {
          productImageId: data?.productImageId,
          productId: data?.productId,
          entityType: 2,
        },
      })
      .then((res) => {
        if (res.status == 200 && res.data?.code) {
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    if (file?.type?.includes("image")) {
      await httpService
        .post("/Attachment/CreateAttachment", formData, {
          params: {
            productImageId: data?.productImageId,
            productId: data?.productId,
            entityType: 2,
          },
        })
        .then((res) => {
          if (res.status == 200 && res.data?.code) {
            handleSaveProductImage(res.data.data.id);
          }
        })
        .catch(() => {});
    } else {
      toast.warn("لطفا فقط از عکس استفاده کنید");
      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (data) {
      setFileList(data?.productImages);
    } else {
      getNewList();
    }
  }, [data]);

  return (
    <>
      <div className="w-full">
        {/* upload */}
        <div className="w-full flex flex-col justify-center items-center">
          <label className="w-fit">
            <div
              className={`${
                loading ? "opacity-50" : ""
              } flex items-center gap-2 mx-auto text-lg rounded-md my-4 cursor-pointer bg-loginForm text-white p-3 py-2`}
            >
              <span>بارگذاری</span> {loading ? <Spin></Spin> : <BiUpload />}
            </div>
            <Input
              hidden
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              disabled={loading}
              accept="image/png, image/gif, image/jpeg"
            />
          </label>

          <div className="mx-auto flex items-center gap-1">
            <span className="text-nowrap">ردیف عکس</span>
            <Input
              type="number"
              placeholder="شماره عکس"
              value={imageNum}
              onChange={(e) => setImageNum(e.target.value)}
              className="w-[50px]"
            />
          </div>
        </div>

        {/* uploaded items */}
        <div className="w-full h-full">
          <div className="w-full py-5">
            <span className="text-2xl font-bold">موارد بارگذاری شده</span>
          </div>

          {/* show files */}
          <div>
            {fileList ? (
              fileList?.length ? (
                <div className="w-full flex gap-2 flex-wrap">
                  {handleRenderFiles()}
                </div>
              ) : (
                <div className="w-full flex justify-center items-center text-gray-500">
                  <span>موردی برای نمایش وجود ندارد!</span>
                </div>
              )
            ) : (
              <div className="w-full flex justify-center items-center py-5">
                <Spin size="large"></Spin>
              </div>
            )}
          </div>
        </div>
      </div>

      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
}
