"use client";

import { useEffect } from "react";
import { loginGithubCallbackApi } from "@/services/authApi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { setLocalStorage } from "@/utils/localStorage";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";

export default function PageCallback() {
  const router = useRouter();

  const handleLogin = async (query) => {
    try {
      const { status, data } = await loginGithubCallbackApi(query);
      if (status >= 200 && status <= 299) {
        setLocalStorage("device_id_current", data.device_id_current);
        Cookies.set("isLogin", true, { expires: 14 });
        toast.success("Đăng nhập thành công");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Xảy ra lỗi trong quá trình đăng nhập");
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    const query = window.location.search;
    handleLogin(query);
  }, []);

  return <Loading backgroundColor="white" zIndex="100" />;
}
