"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { loginGoogleCallbackApi } from "@/services/authApi";
import { setLocalStorage } from "@/utils/localStorage";
import Loading from "@/components/Loading/Loading";

export default function PageCallback() {
  const router = useRouter();

  const handleLogin = async (query) => {
    try {
      const { device_id_current } = await loginGoogleCallbackApi(query);
      // Sửa điều kiện kiểm tra status
      setLocalStorage("device_id_current", device_id_current);
      toast.success("Đăng nhập thành công");
      Cookies.set("isLogin", true, { expires: 14 });
      router.push("/"); // Chuyển hướng về trang chính
    } catch (error) {
      console.log(error);
      toast.error("Xảy ra lỗi trong quá trình đăng nhập");
      router.push("/auth/login"); // Chuyển hướng về trang đăng nhập
    }
  };

  useEffect(() => {
    const query = window.location.search;
    if (query) {
      // Kiểm tra nếu query tồn tại
      handleLogin(query);
    } else {
      router.push("/auth/login"); // Nếu không có query, điều hướng tới trang đăng nhập
    }
  }, [router]); // Thêm router vào dependencies để tránh cảnh báo từ eslint

  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
