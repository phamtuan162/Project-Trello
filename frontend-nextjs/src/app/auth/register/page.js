"use client";
import "../_component/LoginRegister/loginregister.scss";
import { Input, Button, Card, CardBody, Link } from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerApi } from "@/services/authApi";
import { EyeFilledIcon } from "../_component/LoginRegister/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../_component/LoginRegister/EyeSlashFilledIcon ";
import { Message } from "../../../components/Message/Message";
import { Mail, LockKeyhole, User } from "lucide-react";
const PageRegister = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);
  const [typeMessage, setTypeMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const HandleRegister = async (e) => {
    e.preventDefault();
    registerApi(form).then((data) => {
      if (!data.error) {
        const message = data.message;
        setTypeMessage("success");
        setMessage(message);
      } else {
        const error = data.error;
        setTypeMessage("warning");
        setMessage(error);
      }
      setForm({ name: "", email: "", password: "" });
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
          <Message message={message} type={typeMessage} />
          <Input
            startContent={<User size={20} color={"#b9bec7"} />}
            label={
              <label htmlFor="name" className="text-default-400 text-xs">
                Họ và tên
              </label>
            }
            placeholder="Vui lòng nhập tên của bạn..."
            type="name"
            name="name"
            variant={"bordered"}
            labelPlacement="outside"
            onChange={HandleChange}
            value={name}
            size="md"
          />
          <Input
            startContent={<Mail size={20} color={"#b9bec7"} />}
            placeholder="Vui lòng nhập email của bạn..."
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
            placeholder="Vui lòng nhập mật khẩu của bạn..."
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
          <Button type="submit" color="primary" className="w-full text-md ">
            Đăng ký
          </Button>
          <Link href="/auth/login">Bạn đã có tài khoản? Đăng nhập</Link>
        </form>
      </CardBody>
    </Card>
  );
};

export default PageRegister;
