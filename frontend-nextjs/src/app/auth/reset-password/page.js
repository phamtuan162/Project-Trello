"use client";
import "../_component/LoginRegister/loginregister.scss";
import { Input, Button, Card, CardBody, Link } from "@nextui-org/react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Message } from "../../../components/Message/Message";
import { EyeFilledIcon } from "../_component/LoginRegister/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../_component/LoginRegister/EyeSlashFilledIcon ";
import { resetPasswordApi } from "@/services/authApi";
import { LockKeyhole } from "lucide-react";
const PageResetPassword = () => {
  const router = useRouter();
  const query = window.location.search;
  console.log(query);
  const [form, setForm] = useState({
    password_new: "",
    password_verify: "",
  });
  const [message, setMessage] = useState(null);
  const [typeMessage, setTypeMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const HandleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (password_new !== password_verify) {
      setMessage("Xác nhận mật khẩu chưa trùng với Mật khẩu mới");
      return;
    }

    try {
      const { status, message } = await resetPasswordApi(query, {
        password_new: password_new,
      });

      if (200 <= status && status <= 299) {
        setTypeMessage("success");
        setMessage(message);
      }
    } catch (error) {
      if (error.response?.data?.isMessage) {
        setTypeMessage("warning");
        setMessage(error.response.data.message);
      }
      console.log(error);
    } finally {
      setForm({ password_new: "", password_verify: "" });
    }
  };
  const HandleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const { password_new, password_verify } = form;

  return (
    <Card className="login max-w-full w-[400px] h-auto pb-4 ">
      <CardBody className="container   ">
        <h1 className="title ">Làm mới mật khẩu</h1>

        <form
          className="form flex flex-col justify-center items-center gap-4 w-full  px-4"
          onSubmit={HandleResetPassword}
        >
          <Message message={message} type={typeMessage} />
          <Input
            startContent={<LockKeyhole size={20} color={"#b9bec7"} />}
            isRequired
            minLength={6}
            id="password_new"
            name="password_new"
            labelPlacement="outside"
            radius="lg"
            size="sm"
            endContent={
              <button
                className="focus:outline-none "
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className=" text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className=" text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            variant={"bordered"}
            label={
              <label
                htmlFor="password_new"
                className="text-default-400 text-xs "
              >
                Mật khẩu mới
              </label>
            }
            placeholder=" "
            value={password_new}
            onChange={HandleChange}
          />
          <Input
            startContent={<LockKeyhole size={20} color={"#b9bec7"} />}
            isRequired
            minLength={6}
            id="password_verify"
            name="password_verify"
            labelPlacement="outside"
            radius="lg"
            size="sm"
            endContent={
              <button
                className="focus:outline-none "
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className=" text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className=" text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            variant={"bordered"}
            label={
              <label
                htmlFor="password_verify"
                className="text-default-400 text-xs "
              >
                Xác nhận mật khẩu
              </label>
            }
            placeholder=" "
            value={password_verify}
            onChange={HandleChange}
          />
          <a
            href="/auth/login"
            style={{ marginLeft: "auto", fontStyle: "italic" }}
            className="text-xs"
          >
            Quay lại đăng nhập?
          </a>
          <Button
            type="submit"
            color="primary"
            className="w-full text-md interceptor-loading"
          >
            Làm mới mật khẩu
          </Button>
          <Link href="/auth/register">
            Bạn chưa có tài khoản? Tạo tài khoản
          </Link>
        </form>
      </CardBody>
    </Card>
  );
};

export default PageResetPassword;
