import React, { lazy, Suspense, useEffect, useState } from "react";
import useHttp from "../httpConfig/useHttp";
import { useDispatch } from "react-redux";
import { setPageRoutes } from "../../../store/reducers/pageRoutes";
import PageRoutes from "../../../common/PageRoutes";
import { Avatar, Button, Input, Popconfirm, Progress, Skeleton } from "antd";
import { HiRefresh } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const loadings = ["", "", "", "", "", "", "", ""];

const Projects = () => {
  const { httpService } = useHttp();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState(null);
  const [showModal, setShowModal] = useState({ open: false, projectId: null });

  // imports
  const ProjectModal = lazy(() => import("../modals/ProjectModal"));

  const handleGetList = async () => {
    setLoading(true);

    await httpService
      .get("/ProjectController/Projects")
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          setProjects(res.data?.data);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const formData = {
      projectid: id,
    };

    await httpService
      .get("/ProjectController/AdminDeleteProject", { params: formData })
      .then((res) => {
        if (res.data?.code == 1) {
          toast.success("با موفقیت حذف شد");
          handleGetList();
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    dispatch(setPageRoutes([{ label: "مدیریت پروژه" }, { label: "پروژه ها" }]));

    handleGetList();
  }, []);

  return (
    <Suspense fallback={<></>}>
      <div className="w-full min-h-pagesHeight overflow-auto p-5">
        {/* page title */}
        <div className="w-full flex justify-between py-5">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-bold">پروژه ها</h1>
              <PageRoutes />
            </div>

            <div>
              <Button
                onClick={() => setShowModal({ open: true })}
                type="default"
                className="text-[#1f5c88] border-[#1f5c88] border-2 rounded-xl"
              >
                <FaPlus /> تعریف پروژه جدید
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input placeholder="فیلتر عنوان پروژه..." className="h-[50%]" />

            <Button className="" type="text" onClick={handleGetList}>
              <HiRefresh size={"2em"} />
            </Button>
          </div>
        </div>

        {/* list */}
        <div className="w-full flex flex-wrap gap-10 mt-5">
          {!loading ? (
            projects && projects?.length !== 0 ? (
              <>
                {projects.map((pr, index) => (
                  <div
                    key={index}
                    className="w-[220px] min-h-[220px] relative shadow shadow-[rgba(0,0,0,0.5)] rounded-lg hover:scale-y-[20px] cursor-pointer hover:translate-y-[10%]"
                  >
                    {/* options */}
                    <div className="flex gap-2 absolute left-[10px] top-[10px]">
                      <Popconfirm
                        title="آیا از حذف این پروژه اطمینان دارید؟"
                        okText="بله"
                        cancelText="خیر"
                        onConfirm={() => handleDelete(pr?.id)}
                      >
                        <Button
                          size="small"
                          className="p-1"
                          type="primary"
                          danger
                        >
                          <MdDelete className="w-full h-full" size={"2em"} />
                        </Button>
                      </Popconfirm>

                      <Button
                        size="small"
                        className="p-1"
                        type="primary"
                        onClick={() =>
                          setShowModal({ open: true, projectId: pr?.id })
                        }
                      >
                        <IoMdSettings className="w-full h-full" size={"2em"} />
                      </Button>
                    </div>

                    <div
                      onClick={() =>
                        navigate(
                          `/taskmanager/projects/boards?projectId=${pr?.id}`
                        )
                      }
                      className="!z-0 w-full h-full hover:bg-gray-100"
                    >
                      <div className="w-full flex flex-col items-center z-10 p-4 gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <Avatar
                            className={`w-[60px] h-[60px] ${
                              pr?.color ? `bg-[${pr.color}]` : "bg-gray-500"
                            }`}
                            icon={
                              <div className="text-xl flex justify-center items-center">
                                <span>
                                  {pr?.name?.split(" ")[0]
                                    ? pr?.name?.split(" ")[0][0]
                                    : ""}
                                </span>
                                <span>
                                  {pr?.name?.split(" ")[1]
                                    ? pr?.name?.split(" ")[1][0]
                                    : ""}
                                </span>
                              </div>
                            }
                          />
                          <p className="text-xl font-bold">{pr.name}</p>
                        </div>

                        <div className="w-full h-fit flex flex-col text-sm">
                          <span>وضعیت کل پروژه :</span>
                          <Progress
                            className="!text-sm !h-[11px]"
                            percent={pr.projectProgressBar}
                            percentPosition={{ align: "center", type: "inner" }}
                          />
                        </div>

                        <div className="w-full h-fit flex flex-col text-sm">
                          <span>وظایف من :</span>
                          <Progress
                            className="!text-sm !h-[11px]"
                            percent={pr.projectProgressBar}
                            percentPosition={{ align: "center", type: "inner" }}
                          />
                        </div>
                      </div>

                      <div className="w-full h-[2px] border-gray-300 border-[1px] my-[1rem]"></div>

                      <div className="w-full flex flex-col text-sm text-gray-500 p-4">
                        <div className="flex">
                          <span>آخرین وظیفه انجام شده: </span>
                          <span>-</span>
                        </div>
                        <div className="flex self-end mt-[12px]">
                          <span>وظایف انجام شده:</span>
                          <span>0 از 0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* new project */}
                <div
                  onClick={() => {
                    setShowModal({ open: true });
                  }}
                  className="w-[220px] h-[full] border border-dashed border-gray-500 bg-white !text-blue-500 text-xl gap-4 rounded-lg flex flex-col justify-center items-center cursor-pointer"
                >
                  <FaPlus size={"2em"} />
                  <span>پروژه جدید</span>
                </div>
              </>
            ) : null
          ) : (
            <div className="w-full flex flex-grow-1 flex-wrap gap-3">
              {loadings.map((_, index) => (
                <div key={index} className="w-[220px] h-[300px]">
                  <Skeleton.Node style={{ width: "220px", height: "300px" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProjectModal
        open={showModal.open}
        setOpen={(e) => {
          setShowModal({ open: e });
        }}
        id={showModal.projectId}
        getNewList={handleGetList}
      />
    </Suspense>
  );
};

export default Projects;
