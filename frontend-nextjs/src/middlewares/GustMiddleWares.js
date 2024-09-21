"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getLocalStorage } from "@/utils/localStorage";

function GustMiddleWares({ children }) {
  const router = useRouter();

  useEffect(() => {
    const access_token = getLocalStorage("access_token");
    console.log(access_token);
    if (Array.isArray(access_token)) {
      router.push("/auth/login");
    }
  }, [router]);

  return children;
}

export default GustMiddleWares;
