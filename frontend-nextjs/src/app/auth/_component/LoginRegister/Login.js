"use client";
import { Input, Button, Card, CardBody, Link } from "@nextui-org/react";
import "./loginregister.scss";
import { GithubIcon } from "@/components/Icon/GithubIcon";
import { GoogleIcon } from "@/components/Icon/GoogleIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon ";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginGoogleApi, loginLocalApi } from "@/services/authApi";
import { setLocalStorage } from "@/utils/localStorage";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const HandleLoginLocal = async (e) => {
    e.preventDefault();
    loginLocalApi(form).then((data) => {
      if ((data.status = 200)) {
        toast.success("Đăng nhập thành công");
        Cookies.set("access_token", data.access_token, { expires: 7 });
        Cookies.set("refresh_token", data.refresh_token, { expires: 7 });

        router.push("/");
      }
    });
  };

  const HandleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { email, password } = form;

  const loginSocialGoogle = async () => {
    try {
      loginGoogleApi().then((data) => {
        const url_redirect = data.data.urlRedirect;
        window.location.href = url_redirect;
      });
    } catch (error) {
      console.error("Error login google:", error);
    }
  };
  return (
    <Card className="login max-w-full w-[500px] h-auto pb-10 ">
      <CardBody className="container   ">
        <h1 className="title ">Đăng nhập</h1>
        <form
          className="form flex flex-col justify-center items-center gap-4 w-full  px-10"
          onSubmit={HandleLoginLocal}
        >
          <Input
            label="Email"
            placeholder="Vui lòng nhập email của bạn..."
            type="email"
            name="email"
            variant={"bordered"}
            autoComplete={"off"}
            onChange={HandleChange}
            value={email}
            size="lg"
            isRequired
          />
          <Input
            name="password"
            label="Mật khẩu"
            placeholder="Vui lòng nhập mật khẩu của bạn..."
            variant="bordered"
            autoComplete={"off"}
            onChange={HandleChange}
            value={password}
            size="lg"
            isRequired
            endContent={
              <button
                className="focus:outline-none "
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />

          <span style={{ marginLeft: "auto", fontStyle: "italic" }}>
            Quên mật khẩu?
          </span>
          <Button type="submit" color="primary" className="w-full text-lg ">
            Đăng nhập
          </Button>
          <div className="modal__line">
            <span>hoặc</span>
          </div>
          <div className="flex gap-3 w-full ">
            <Button type="button" variant="ghost" className="flex-1 text-lg ">
              <GithubIcon /> Github
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-lg"
              onClick={loginSocialGoogle}
            >
              <GoogleIcon /> Google
            </Button>
          </div>
          <Link href="/auth/register">
            Bạn chưa có tài khoản? Tạo tài khoản
          </Link>
        </form>
      </CardBody>
    </Card>
  );
};

export default Login;
