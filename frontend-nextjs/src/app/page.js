"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Loading from "@/components/Loading/Loading";

export default function Home() {
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập ngay lập tức
    const isLogin = Cookies.get("isLogin");

    // if (isLogin === "false") {
    //   router.push(`/auth/login`);
    //   return;
    // }

    if (user?.workspace_id_active && workspace?.id) {
      router.push(`/w/${user.workspace_id_active}/home`);
    }
  }, [user, workspace, router]);
  return <Loading backgroundColor="white" zIndex="100" />;
}
