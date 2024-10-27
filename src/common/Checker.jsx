import React, { useEffect } from "react";
import useHttp from "../hooks/useHttps";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData, setUserRole } from "../store/reducers/userDataReducer";
import { setAllEnum } from "../store/reducers/enumReducer";

export default function Checker() {
  const { httpService } = useHttp();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  const handleGetUserData = () => {
    httpService
      .get("Account/UserDetailsByToken")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          if (res.data?.data.isAdmin === 1) {
            dispatch(setUserRole("admin"));
          } else {
            dispatch(setUserRole("user"));
          }
          dispatch(setUserData(res.data.data));
        } else {
          toast.warn(res.data.msg);
          navigate("/login");
        }
      })
      .catch(() => {
        setTimeout(() => {
          handleGetUserData();
        }, 10000);
      });
  };

  const handleGetEnum = () => {
    httpService
      .get("Enum/AllEnums")
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          dispatch(setAllEnum(res.data.data));
        } else {
          // toast(res.data.msg);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    // get project enums
    handleGetEnum();

    if (token) {
      // dispatch(setUserRole("user"));
      handleGetUserData();
    } else {
      navigate("/login");
    }
  }, [token]);

  return <></>;
}
