import { Button, Form, Image, Input } from "antd";
import background from "../../assets/images/login-image.png";
import logo from "../../assets/images/logo.svg";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData, setUserRole } from "../../store/reducers/userDataReducer";
import { useEffect, useState } from "react";
import useHttp from "../../hooks/useHttps";
import { toast } from "react-toastify";

export default function Login() {
  const { httpService } = useHttp();
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    userName: yup.string().required("لطفا نام کاربری خود را وارد کنید"),
    password: yup.string().required("لطفا رمز عبور خود را وارد کنید"),
  });

  const validations = useFormik({
    initialValues: { userName: "", password: "" },

    validationSchema,

    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const handleLogin = async (values) => {
    setLoading(true);

    const formData = {
      userName: values.userName,
      password: values.password,
    };

    await httpService
      .post("/Account/Login", formData)
      .then((res) => {
        if (res.status === 200 && res.data?.code === 1) {
          // const cookies = new Cookies();
          // cookies.set("Authorization", res.data?.jwtToken, { httpOnly: true });
          localStorage.setItem("token", res.data?.jwtToken);
          dispatch(setUserRole(res.data?.userRole?.toLocaleLowerCase()));
          dispatch(setUserData(res.data));
          navigate("/");
        } else {
          toast(res.data.msg);
        }
      })
      .catch(() => {});

    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/");
    } else {
      setShowData(true);
    }
  }, []);

  if (showData)
    return (
      <>
        <div className="flex justify-center items-center w-full min-h-contentHeight relative overflow-hidden bg-white">
          {/* form container */}
          <section className="min-w-[40%] h-full flex justify-center items-center p-5">
            {/* form */}
            <Form
              onFinish={validations.handleSubmit}
              className="flex flex-col h-full bg-loginForm text-white rounded-[15px] max-w-full p-4 lg:gap-6 lg:p-10 z-20"
            >
              {/* header */}
              <div className="w-full flex justify-between items-center gap-6 text-white text-2xl font-extrabold">
                <h1>به پنل XRM خوش آمدید!</h1>
                <div className="w-[40px]">
                  <img className="w-full" src={logo} alt="logo" />
                </div>
              </div>

              {/* inputs */}
              <div className="flex flex-col gap-6 text-white">
                <div className="flex flex-col">
                  <span>نام کاربری</span>
                  <Input
                    placeholder="نام کاربری خود را وارد کنید"
                    size="large"
                    value={validations.values.userName}
                    onChange={validations.handleChange}
                    name="userName"
                    status={
                      validations.touched.userName &&
                      validations.errors.userName &&
                      "error"
                    }
                  />
                  {validations.touched.userName &&
                    validations.errors.userName && (
                      <span className="text-sm text-error">
                        {validations.errors.userName}
                      </span>
                    )}
                </div>
                <div className="flex flex-col">
                  <span className="">رمز عبور</span>
                  <Input.Password
                    placeholder="رمز عبور خود را وارد کنید"
                    size="large"
                    value={validations.values.password}
                    onChange={validations.handleChange}
                    name="password"
                    status={
                      validations.touched.password &&
                      validations.errors.password &&
                      "error"
                    }
                  />
                  {validations.touched.password &&
                    validations.errors.password && (
                      <span className="text-sm text-error">
                        {validations.errors.password}
                      </span>
                    )}
                </div>
              </div>

              {/* forgot password option */}
              <div className="w-full text-start">
                <span className="text-sm cursor-pointer hover:text-gray-300">
                  رمز عبور خود را فراموش کرده اید؟
                </span>
              </div>

              {/* submit button */}
              <div className="w-full flex justify-center items-center">
                <Button
                  htmlType="submit"
                  type="primary"
                  className="min-w-[120px] text-lg mt-16"
                  loading={loading}
                  disabled={loading}
                >
                  ورود
                </Button>
              </div>

              {/* tags */}
              <div className="w-full flex justify-between text-xs">
                <span>شرکت گرانتیل</span>
                <div className="flex gap-1">
                  <span>نسخه : </span>
                  <span>1.0.0</span>
                </div>
              </div>
            </Form>
          </section>

          {/* background */}
          <section className="w-full h-full flex justify-center items-start overflow-hidden mt-[100px] blur-sm fixed -z-10 sm:z-10 lg:relative lg:items-center lg:blur-0 lg:mt-0">
            <Image
              preview={false}
              src={background}
              alt="background"
              className="w-full h-full min-w-[420px] pointer-events-none"
            />
          </section>
        </div>
      </>
    );
}
