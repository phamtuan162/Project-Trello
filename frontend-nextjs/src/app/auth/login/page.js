"use client";
import { Input, Button, Card, CardBody, Link } from "@nextui-org/react";
import "../_component/LoginRegister/loginregister.scss";
import { GithubIcon } from "@/components/Icon/GithubIcon";
import { GoogleIcon } from "@/components/Icon/GoogleIcon";
import { EyeFilledIcon } from "../_component/LoginRegister/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../_component/LoginRegister/EyeSlashFilledIcon ";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginGoogleApi, loginLocalApi } from "@/services/authApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Message } from "../../../components/Message/Message";
import { setLocalStorage } from "@/utils/localStorage";
import { Mail, LockKeyhole, User } from "lucide-react";

const PageLogin = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const HandleLoginLocal = async (e) => {
    e.preventDefault();

    loginLocalApi(form).then((data) => {
      if (!data.error) {
        toast.success("Đăng nhập thành công");
        setLocalStorage("device_id_current", data.device_id_current);
        Cookies.set("access_token", data.access_token, { expires: 7 });
        Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
        router.push("/");
      } else {
        const error = data.error;
        setErrorMessage(error);
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
    <Card className="login max-w-full w-[400px] h-auto pb-4 ">
      <CardBody className="container   ">
        <h1 className="title text-md">Đăng nhập</h1>

        <form
          className="form flex flex-col justify-center items-center gap-4 w-full  px-10 mt-10"
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
                className="focus:outline-none "
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
          />
          <a
            href="/auth/forgot-password"
            style={{ marginLeft: "auto", fontStyle: "italic" }}
          >
            Quên mật khẩu?
          </a>
          <Button type="submit" color="primary" className="w-full text-md ">
            Đăng nhập
          </Button>
          <div className="modal__line">
            <span>hoặc</span>
          </div>
          <div className="flex gap-3 w-full ">
            <Button type="button" variant="ghost" className="flex-1 text-md ">
              <GithubIcon /> Github
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-md"
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

export default PageLogin;
