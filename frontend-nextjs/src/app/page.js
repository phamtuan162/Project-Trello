"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading/Loading";
import { useSelector } from "react-redux";
import { getWorkspaceDetail } from "@/services/workspaceApi";
export default function Home() {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  useEffect(() => {
    if (user.workspace_id_active) {
      getWorkspaceDetail(user.workspace_id_active).then((data) => {
        router.push(`/w/${data.id}/boards`);
      });
    }
  }, [user]);
  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
