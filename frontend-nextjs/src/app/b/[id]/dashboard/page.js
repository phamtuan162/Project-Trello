"use client";
import { useSelector } from "react-redux";
import { useState } from "react";
import BarChart from "./BarChart";
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
          <div className="h-full w-full overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-4 grid-row-2">
            {charts.map((chart, index) => (
              <BarChart key={index} chart={chart} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
