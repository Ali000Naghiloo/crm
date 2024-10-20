import React, { lazy, Suspense, useEffect, useState } from "react";
import useHttp from "../../httpConfig/useHttp";
import { useDispatch } from "react-redux";
import { setPageRoutes } from "../../../../store/reducers/pageRoutes";
import PageRoutes from "../../../../common/PageRoutes";
import { Avatar, Button, Input, Progress, Skeleton } from "antd";
import { HiRefresh } from "react-icons/hi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { useWindowSize } from "@uidotdev/usehooks";
import { IoMdSettings } from "react-icons/io";
const loadings = ["", "", "", "", "", "", "", ""];

const Projects = () => {
  const { httpService } = useHttp();
  const dispatch = useDispatch();
  const size = useWindowSize();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState(null);
  const [showModal, setShowModal] = useState({ open: false, boradId: null });
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const BoardModal = lazy(() => import("../../modals/BoardModal"));

  const handleGetList = async () => {
    setLoading(true);
    const formData = {
      projectId: projectId,
    };

    await httpService
      .get("/BoardController/Boards", { params: formData })
      .then((res) => {
        if (res.status == 200 && res.data?.code == 1) {
          setBoards(res.data?.data);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      setPageRoutes([
        { label: "مدیریت برد" },
        { label: "پروژه ها" },
        { label: "برد ها" },
      ])
    );

    handleGetList();
  }, []);

  return (
    <Suspense fallback={<></>}>
      <div className="w-full min-h-pagesHeight overflow-auto p-5">
        {/* page title */}
        <div className="w-full flex justify-between py-5">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-bold">برد ها</h1>
              <PageRoutes />
            </div>

            <div>
              <Button
                onClick={() => setShowModal({ open: true })}
                type="default"
                className="text-[#1f5c88] border-[#1f5c88] border-2 rounded-xl"
              >
                <FaPlus /> تعریف برد جدید
              </Button>
            </div>
          </div>

          <div className="flex flex-col-reverse lg:flex-row items-center gap-2">
            <Input
              placeholder="فیلتر عنوان برد..."
              className="h-[30%] lg:h-[50%]"
              size="small"
            />

            <div className="flex justify-center items-center gap-2">
              <Button className="" type="text" onClick={handleGetList}>
                <HiRefresh size={"2em"} />
              </Button>

              <Button
                onClick={() => navigate(-1)}
                type="text"
                className="text-2xl p-0"
              >
                <span className="">بازگشت</span>
                <FaAngleLeft />
              </Button>
            </div>
          </div>
        </div>

        {/* list */}
        <div className="w-full flex flex-wrap gap-10 mt-5">
          {!loading ? (
            boards && boards?.length !== 0 ? (
              <>
                {boards.map((br, index) => (
                  <div
                    key={index}
                    className="w-[220px] min-h-[220px] relative shadow shadow-[rgba(0,0,0,0.5)] rounded-lg hover:scale-y-[20px] cursor-pointer hover:translate-y-[10%]"
                  >
                    {/* options */}
                    <div className="absolute left-[15px] top-[15px]">
                      <Button
                        className="p-1"
                        type="primary"
                        onClick={() =>
                          setShowModal({ open: true, boradId: br?.id })
                        }
                      >
                        <IoMdSettings className="w-full h-full" size={"2em"} />
                      </Button>
                    </div>

                    <div
                      onClick={() =>
                        navigate(
                          `/taskmanager/projects/boards/board?boardId=${br?.id}`
                        )
                      }
                      className="!z-0 w-full h-full hover:bg-gray-100"
                    >
                      <div className="w-full flex flex-col items-center p-4 gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <Avatar
                            className={`w-[60px] h-[60px] ${
                              br?.color ? `bg-[${br.color}]` : "bg-gray-500"
                            }`}
                            icon={
                              <div className="text-xl flex justify-center items-center">
                                <span>
                                  {br?.name?.split(" ")[0]
                                    ? br?.name?.split(" ")[0][0]
                                    : ""}
                                </span>
                                <span>
                                  {br?.name?.split(" ")[1]
                                    ? br?.name?.split(" ")[1][0]
                                    : ""}
                                </span>
                              </div>
                            }
                          />
                          <p className="text-xl font-bold">{br.name}</p>
                        </div>

                        <div className="w-full h-fit flex flex-col text-sm">
                          <span>وضعیت کل برد :</span>
                          <Progress
                            className="!text-sm !h-[11px]"
                            percent={br.projectProgressBar}
                            percentPosition={{ align: "center", type: "inner" }}
                          />
                        </div>

                        <div className="w-full h-fit flex flex-col text-sm">
                          <span>وظایف من :</span>
                          <Progress
                            className="!text-sm !h-[11px]"
                            percent={br.projectProgressBar}
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
                  className="w-[220px] h-[350px] border border-dashed mx-auto lg:mx-0 border-gray-500 bg-white !text-blue-500 text-xl gap-4 rounded-lg flex flex-col justify-center items-center cursor-pointer"
                >
                  <FaPlus size={"2em"} />
                  <span>برد جدید</span>
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

      <BoardModal
        open={showModal.open}
        setOpen={(e) => {
          setShowModal({ open: e });
        }}
        id={showModal.boradId}
        getNewList={handleGetList}
        projectId={projectId}
      />
    </Suspense>
  );
};

export default Projects;
