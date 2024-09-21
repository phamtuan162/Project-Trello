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
        if (data.status === 200) {
          const workspace = data.data;
          router.push(`/w/${workspace.id}/home`);
        }
      });
    }
  }, [user]);
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     window.addEventListener("load", () => {
  //       navigator.serviceWorker
  //         .register("/service-worker.js")
  //         .then((registration) => {
  //           console.log(
  //             "Service Worker registered with scope:",
  //             registration.scope
  //           );
  //         })
  //         .catch((error) => {
  //           console.log("Service Worker registration failed:", error);
  //         });
  //     });
  //   }
  // }, []);
  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
