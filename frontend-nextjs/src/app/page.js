"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "@/stores/middleware/fetchData";
export default function Home() {
  const dispatch = useDispatch();

  const workspace = useSelector((state) => state.workspace.workspaces);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  console.log(workspace);
  return (
    <div className="flex gap-x-7 h-full justify-center ">
      <Sidebar />
      <div className="all-boards grow">
        <h1>Home</h1>
      </div>
    </div>
  );
}
