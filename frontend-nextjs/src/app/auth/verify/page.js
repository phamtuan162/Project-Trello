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
    verifyAccountApi(query).then((data) => {
      if (data.status === 200) {
        const message = data.message;
        toast.success(message);
        router.push("/auth/login");
      } else {
        const message = data.error;
        toast.danger(message);
        router.push("/auth/forgot-password");
      }
    });
  }, []);

  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
