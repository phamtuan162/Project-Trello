"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading/Loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/w/1/home");
  }, []);
  return <Loading backgroundColor={"white"} zIndex={"100"} />;
}
