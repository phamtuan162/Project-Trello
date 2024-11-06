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
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const handleLogin = async () => {
      const query = window.location.search;
      try {
        const { status } = await loginGoogleCallbackApi(query);
        if (200 <= status && status <= 200) {
          setLocalStorage("device_id_current", data.device_id_current);
          toast.success("Đăng nhập thành công");
          Cookies.set("isLogin", true, { expires: 14 });
          router.push("/");
          setIsLogin(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!isLogin && typeof window !== "undefined") {
      handleLogin();
    }
  }, [isLogin, router]);

  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
