"use client";
import { useEffect, useState } from "react";
import { loginGithubCallbackApi } from "@/services/authApi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { setLocalStorage } from "@/utils/localStorage";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";
export default function pageCallback() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const query = typeof window !== "undefined" ? window.location.search : "";

    if (query && !isLogin) {
      loginGithubCallbackApi(query).then((data) => {
        if (data.status === 200) {
          setLocalStorage("device_id_current", data.device_id_current);
          toast.success("Đăng nhập thành công");
          Cookies.set("access_token", data.access_token, { expires: 7 });
          Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
          router.push("/");
          setIsLogin(true);
        } else {
          const error = data.error;
          toast.error(error);
        }
      });
    }
  }, [isLogin, router]);

  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
