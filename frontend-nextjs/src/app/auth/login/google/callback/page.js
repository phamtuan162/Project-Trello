"use client";
import { useEffect, useState } from "react";
import { loginGoogleCallbackApi } from "@/services/authApi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { setLocalStorage } from "@/utils/localStorage";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";
export default function pageCallback() {
  const router = useRouter();
  const handleLogin = async (query) => {
    try {
      const { status } = await loginGoogleCallbackApi(query);
      if (200 <= status && status <= 200) {
        setLocalStorage("device_id_current", data.device_id_current);
        toast.success("Đăng nhập thành công");
        Cookies.set("isLogin", true, { expires: 14 });
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

  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
