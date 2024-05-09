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
  const typeCharts = [
    {
      type: "bar",
      img: "https://trello.com/assets/55cff8a7bdbb984d52a9.svg",
      imgFocus: "https://trello.com/assets/e29e573f10fa017763a6.svg",
      label: "Biểu đồ dạng thanh",
    },
    {
      type: "line",
      img: "https://trello.com/assets/1c7f512ac23a684199cc.svg",
      imgFocus: "https://trello.com/assets/19c36f264c9e64ffcdca.svg",

      label: "Biểu đồ đường",
    },
    {
      type: "pie",
      img: "https://trello.com/assets/3f8975672b9de5120e32.svg",
      imgFocus: "https://trello.com/assets/19c36f264c9e64ffcdca.svg",

      label: "Biểu đồ dạng bánh",
    },
  ];
  const times = [
    { label: "Tuần qua", value: "week" },
    {
      label: "Hai tuần qua",
      value: "two_weeks",
    },
    { label: "Tháng qua", value: "month" },
  ];
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
            <Chart1 typeCharts={typeCharts} times={times} />
            <Chart2 typeCharts={typeCharts} times={times} />
            <Chart3 typeCharts={typeCharts} times={times} />
          </div>
        </div>
      </div>
    </div>
  );
}
