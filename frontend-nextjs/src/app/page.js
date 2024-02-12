"use client";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function Home() {
  return (
    <div className="flex gap-x-7 justify-center pt-20">
      <Sidebar />
      <div className="all-boards">
        <h1>Home</h1>
      </div>
    </div>
  );
}
