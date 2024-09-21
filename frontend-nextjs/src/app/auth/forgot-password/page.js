"use client";
import "../_component/LoginRegister/loginregister.scss";
import { Mail } from "lucide-react";
import { Input, Button, Card, CardBody, Link } from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Message } from "../../../components/Message/Message";
import { forgotPasswordApi } from "@/services/authApi";
const PageForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [typeMessage, setTypeMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const HandleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    forgotPasswordApi({ email: email }).then((data) => {
      if (!data.error) {
        const message = data.message;
        setTypeMessage("success");
        setMessage(message);
      } else {
        const error = data.error;
        setTypeMessage("warning");
        setMessage(error);
      }
    });
  };

  return (
    <Card className="login max-w-full w-[400px] h-auto pb-4 ">
      <CardBody className="container   ">
        <h1 className="title ">Quên mật khẩu</h1>

        <form
          className="form flex flex-col justify-center items-center gap-4 w-full  px-4"
          onSubmit={HandleForgotPassword}
        >
          <span className="text-center">
            Bạn quên mật khẩu cần lấy lại mật khẩu!
          </span>
          <Message message={message} type={typeMessage} />
          <Input
            startContent={<Mail size={20} color={"#b9bec7"} />}
            isRequired
            id="email"
            name="email"
            labelPlacement="outside"
            size="lg"
            type="email"
            variant={"bordered"}
            label={
              <label htmlFor="email" className="text-default-400 text-xs">
                Email
              </label>
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            radius="lg"
            placeholder="Nhập email của bạn..."
          />

          <Button type="submit" color="primary" className="w-full text-md ">
            Gửi link
          </Button>
          <Link href="/auth/login">Quay lại Đăng nhập</Link>
        </form>
      </CardBody>
    </Card>
  );
};

export default PageForgotPassword;
