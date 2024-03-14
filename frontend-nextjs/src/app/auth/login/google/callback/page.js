"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { loginGoogleCallbackApi } from "@/services/authApi";
export default function pageCallback(request) {
  const query = window.location.search;

  useEffect(() => {
    if (query) {
      loginGoogleCallbackApi(query).then((data) => {
        console.log(data);
      });
    }
  }, []);

  return <h1>Hello world</h1>;
}
