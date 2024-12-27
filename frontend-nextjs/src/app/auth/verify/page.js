"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

import Loading from "@/components/Loading/Loading";
import { verifyAccountApi } from "@/services/authApi";

export default function PageVerify() {
  const router = useRouter();

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const query = window.location.search; // Đảm bảo lấy query khi client-side
        const { message } = await verifyAccountApi(query);
        toast.success(message);
        router.push("/auth/login");
      } catch (error) {
        // Xử lý lỗi khi không có dữ liệu hoặc API không thành công
        if (error.response?.data?.isMessage) {
          toast.error(error.response.data.message);
          router.push("/auth/forgot-password");
        }
        console.log(error);
      }
    };

    verifyAccount(); // Gọi hàm async
  }, [router]); // Chỉ chạy effect khi router thay đổi

  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
