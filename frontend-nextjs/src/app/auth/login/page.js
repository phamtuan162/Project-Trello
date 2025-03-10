"use client";

import { Button } from "@nextui-org/button";
import { Input, Card, CardBody, Link } from "@nextui-org/react";
import "../_component/LoginRegister/loginregister.scss";
import { GithubIcon } from "@/components/Icon/GithubIcon";
import { GoogleIcon } from "@/components/Icon/GoogleIcon";
import { EyeFilledIcon } from "../_component/LoginRegister/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../_component/LoginRegister/EyeSlashFilledIcon ";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loginGoogleApi,
  loginLocalApi,
  loginGithubApi,
} from "@/services/authApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Message } from "../../../components/Message/Message";
import { setLocalStorage } from "@/utils/localStorage";
import { Mail, LockKeyhole } from "lucide-react";

const PageLogin = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Trì hoãn việc hiển thị các phần có thể ảnh hưởng đến SSR
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const HandleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const HandleLoginLocal = async (e) => {
    e.preventDefault();
    try {
      await toast
        .promise(async () => await loginLocalApi(form), {
          pending: "Đang đăng nhập...",
          error: "Đăng nhập không thành công",
        })
        .then((res) => {
          const { device_id_current } = res;
          setLocalStorage("device_id_current", device_id_current);
          Cookies.set("isLogin", true, { expires: 14 });
          router.push("/");
          toast.success("Đăng nhập thành công");
        })
        .catch((error) => {
          if (error.response?.data?.isMessage) {
            setErrorMessage(error.response.data.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const loginSocialGoogle = async () => {
    try {
      const { status, data } = await loginGoogleApi();

      if (status >= 200 && status < 300) {
        const url_redirect = data?.urlRedirect;
        if (url_redirect) {
          window.location.href = url_redirect;
        } else {
          toast.error("Không tìm thấy URL chuyển hướng.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginSocialGithub = async () => {
    try {
      const { status, data } = await loginGithubApi();

      if (status >= 200 && status < 300) {
        const url_redirect = data?.urlRedirect;
        if (url_redirect) {
          window.location.href = url_redirect;
        } else {
          toast.error("Không tìm thấy URL chuyển hướng.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { email, password } = form;

  if (!isClient) return null; // Đảm bảo rằng component chỉ render trên client

  return (
    <Card className="login max-w-full w-[400px] h-auto pb-4">
      <CardBody className="container">
        <h1 className="title text-md">Đăng nhập</h1>

        <form
          className="form flex flex-col justify-center items-center gap-2 w-full px-10 mt-10"
          onSubmit={HandleLoginLocal}
        >
          <Message message={errorMessage} />
          <Input
            startContent={<Mail size={20} color={"#b9bec7"} />}
            placeholder="Nhập email của bạn..."
            labelPlacement="outside"
            size="lg"
            type="email"
            variant={"bordered"}
            label={
              <label htmlFor="email" className="text-default-400 text-xs">
                Email
              </label>
            }
            name="email"
            onChange={HandleChange}
            value={email}
            className="bg-white"
            isRequired
            tabIndex={1}
          />
          <Input
            startContent={<LockKeyhole size={20} color={"#b9bec7"} />}
            name="password"
            labelPlacement="outside"
            placeholder="Nhập mật khẩu của bạn..."
            variant="bordered"
            label={
              <label htmlFor="password" className="text-default-400 text-xs">
                Mật khẩu
              </label>
            }
            onChange={HandleChange}
            value={password}
            size="md"
            isRequired
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-md text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-md text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            tabIndex={1}
          />

          <Link
            href="/auth/forgot-password"
            style={{ marginLeft: "auto", fontStyle: "italic" }}
          >
            Quên mật khẩu?
          </Link>

          <Button
            type="submit"
            color="primary"
            className="w-full text-md interceptor-loading"
          >
            Đăng nhập
          </Button>
          <div className="modal__line">
            <span className="text-sm">hoặc</span>
          </div>
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-md interceptor-loading"
              onClick={loginSocialGithub}
            >
              <GithubIcon size={24} /> Github
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-md interceptor-loading"
              onClick={loginSocialGoogle}
            >
              <GoogleIcon size={24} /> Google
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

export default PageLogin;
