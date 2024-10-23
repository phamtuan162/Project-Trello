"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Loading from "@/components/Loading/Loading";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const router = useRouter();

  useEffect(() => {
    if (user.workspace_id_active && workspace.id) {
      router.push(`/w/${user.workspace_id_active}/home`);
    }
  }, [user, workspace]);

  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
