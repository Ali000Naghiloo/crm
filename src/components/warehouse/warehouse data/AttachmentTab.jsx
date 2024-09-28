import { Button, Image, Input, Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import useHttp, { baseURL } from "../../../hooks/useHttps";
import { TiPlusOutline } from "react-icons/ti";
import { BiDownload, BiUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import formatHelper from "../../../helper/formatHelper";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function AttachmentTab({ data, getNewList }) {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  // file list
  const [fileList, setFileList] = useState(null);
  const [file, setFile] = useState(null);
  // preview settings
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleDelete = async (id) => {
    setLoading(true);

    await httpService
      .get("/Attachment/DeleteAttachment", {
        params: { attachmentid: id },
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
            {fileList.map(
              (file, index) =>
                file?.fileType?.includes("image") && (
                  <div key={index} className="w-fit flex flex-col gap-1">
                    <span>{formatHelper.cutString(file?.name, 0, 10)}</span>
                    <div className="w-20 h-20 flex justify-center items-center rounded-md border-gray-100 border-2 overflow-hidden">
                      <Image
                        width={"100%"}
                        height={"100%"}
                        src={file?.url}
                        loading="lazy"
                        className="w-full h-full !rounded-md"
                        fallback={
                          "https://archive.org/download/placeholder-image/placeholder-image.jpg"
                        }
                        alt={file.name}
                      />
                    </div>

                    <Button
                      onClick={() => handleDelete(file.uid)}
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
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <i>فایل ها</i>
          <div className="w-full flex flex-col gap-2">
            {fileList.map(
              (file, index) =>
                !file?.fileType?.includes("image") && (
                  <>
                    <div
                      key={index}
                      className="w-full flex justify-between items-center hover:bg-gray-300 rounded-md p-1 shadow-lg"
                    >
                      <span>{file?.name}</span>
                      <div className="flex gap-1">
                        <a href={`${file?.url}`} target="_blank">
                          <Button>
                            <BiDownload />
                          </Button>
                        </a>
                        <Button
                          danger
                          type="primary"
                          disabled={loading}
                          loading={loading}
                          onClick={() => handleDelete(file?.uid)}
                        >
                          <MdDelete />
                        </Button>
                      </div>
                    </div>
                  </>
                )
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    await httpService
      .post("/Attachment/CreateAttachment", formData, {
        params: { customerId: data?.customerId, entityType: 1 },
      })
      .then((res) => {
        if (res.status == 200 && res.data?.code) {
          getNewList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);

  useEffect(() => {
    let datas = [];
    console.log(data?.customerAttachments);

    if (data) {
      data?.customerAttachments?.map((data, index) => {
        datas.push({
          uid: data?.id,
          name: data?.fileName,
          status: "done",
          url: data?.filePath,
          fileType: data?.fileType,
        });
      });

      setFileList(datas);
    }
  }, [data]);

  return (
    <>
      <div className="w-full">
        {/* upload */}
        <div className="w-full flex justify-center items-center">
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
            />
          </label>
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
