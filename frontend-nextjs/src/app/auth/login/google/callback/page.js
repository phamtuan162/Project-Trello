"use client";
import { useEffect, useState } from "react";
import { loginGoogleCallbackApi } from "@/services/authApi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { setLocalStorage } from "@/utils/localStorage";
import Loading from "@/components/Loading/Loading";
export default function pageCallback() {
  const query = window.location.search;
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (!isLogin) {
      loginGoogleCallbackApi(query).then((data) => {
        if (data.status === 200) {
          setLocalStorage("device_id_current", data.device_id_current);
          Cookies.set("access_token", data.access_token, { expires: 7 });
          Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
          router.push("/");
          setIsLogin(true);
        }
      });
    }
  }, []);

  return <Loading />;
}
