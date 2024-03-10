"use client";
import "./loginregister.scss";
import { Input, Button, Card, CardBody, Link } from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { registerApi } from "@/services/authApi";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon ";
import { Message } from "../../../../components/Message/Message";
const Register = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const HandleRegister = async (e) => {
    e.preventDefault();
    registerApi(form).then((data) => {
      if (!data.error) {
        toast.success("Đăng ký thành công");
        router.push("/auth/login");
      } else {
        const error = data.error;
        setErrorMessage(error);
      }
    });
  };
  const HandleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { name, email, password } = form;
  return (
    <Card className="login max-w-full w-[400px] h-auto pb-4 ">
      <CardBody className="container   ">
        <h1 className="title ">Đăng ký</h1>

        <form
          className="form flex flex-col justify-center items-center gap-4 w-full  px-4"
          onSubmit={HandleRegister}
        >
          <span className="text-center">
            Hoàn thành đăng ký, và bắt đầu trải nghiệm ngay!
          </span>
          <Message message={errorMessage} />
          <Input
            label="Họ và tên"
            placeholder="Vui lòng nhập tên của bạn..."
            type="name"
            name="name"
            variant={"bordered"}
            autoComplete={"off"}
            onChange={HandleChange}
            value={name}
            size="md"
          />
          <Input
            label="Email"
            placeholder="Vui lòng nhập email của bạn..."
            type="email"
            name="email"
            variant={"bordered"}
            autoComplete={"off"}
            onChange={HandleChange}
            value={email}
            size="md"
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
          <Button type="submit" color="primary" className="w-full text-md ">
            Đăng ký
          </Button>
          <Link href="/auth/login">Bạn đã có tài khoản? Đăng nhập</Link>
        </form>
      </CardBody>
    </Card>
  );
};

export default Register;
