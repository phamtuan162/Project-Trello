"use client";
import { useSelector } from "react-redux";
import { useState } from "react";
import Chart1 from "./Chart1";
import Chart2 from "./Chart2";
import Chart3 from "./Chart3";
import Loading from "@/components/Loading/Loading";
import { useParams } from "next/navigation";
export default function dashboardPage() {
  const { id: boardId } = useParams();
  const board = useSelector((state) => state.board.board);
  if (!board.id || +board.id !== +boardId) {
    return <Loading />;
  }
  const charts = [{ type: "bar" }, { type: "line" }, { type: "pie" }];
  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center grow "
      style={{
        backgroundImage: board?.background ? `url(${board.background})` : "",
      }}
    >
      <div className=" h-full  pb-2 flex">
        <div
          style={{ backgroundColor: "#f1f2f4" }}
          className=" mt-14 mx-2 grow p-4   rounded-lg "
        >
          <div className="h-full w-full overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-4 grid-row-2 py-1">
            <Chart1 />
            <Chart2 />
            <Chart3 />
          </div>
        </div>
      </div>
    </div>
  );
}
