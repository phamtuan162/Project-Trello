"use client";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import { useEffect } from "react";
import { verifyAccountApi } from "@/services/authApi";
import { toast } from "react-toastify";
export default function pageVerify() {
  const query = window.location.search;
  const router = useRouter();
  useEffect(async () => {
    try {
      const { status, message } = await verifyAccountApi(query);
      if (200 <= status && status <= 299) {
        toast.success(message);
        router.push("/auth/login");
      }
    } catch (error) {
      if (error.response?.data?.isMessage) {
        toast.danger(error.response.data.message);
        router.push("/auth/forgot-password");
      }
      console.log(error);
    }
  }, []);

  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
