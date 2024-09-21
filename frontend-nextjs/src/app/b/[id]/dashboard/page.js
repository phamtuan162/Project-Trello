"use client";
import { useSelector } from "react-redux";
import Chart1 from "./Chart1";
import Chart2 from "./Chart2";
import Chart3 from "./Chart3";
import Chart4 from "./Chart4";
import Chart5 from "./Chart5";
import Chart6 from "./Chart6";

import Loading from "@/components/Loading/Loading";
import { useParams } from "next/navigation";
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
const colors = [
  "rgba(255, 99, 132, 0.8)", // Màu đỏ
  "rgba(255, 159, 64, 0.8)", // Màu cam
  "rgba(255, 205, 86, 0.8)", // Màu vàng
  "rgba(75, 192, 192, 0.8)", // Màu xanh nhạt
  "rgba(54, 162, 235, 0.8)", // Màu xanh lam
  "rgba(153, 102, 255, 0.8)", // Màu tím
  "rgba(201, 203, 207, 0.8)", // Màu xám
  "rgba(255, 99, 71, 0.8)", // Màu đỏ cà chua
  "rgba(60, 179, 113, 0.8)", // Màu xanh lá cây
  "rgba(106, 90, 205, 0.8)", // Màu xanh tím
  "rgba(244, 164, 96, 0.8)", // Màu cam nhạt
  "rgba(30, 144, 255, 0.8)", // Màu xanh dương đậm
];

export default function dashboardPage() {
  const { id: boardId } = useParams();
  const board = useSelector((state) => state.board.board);

  const handleDownload = (chartRef, type) => {
    if (chartRef && chartRef.current) {
      const canvas = chartRef.current;
      const context = canvas.getContext("2d");

      // Draw white background
      context.save();
      context.globalCompositeOperation = "destination-over";
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();

      const file = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = file;
      link.download = `${type}Chart.png`;
      link.click();
    }
  };

  if (!board.id || +board.id !== +boardId) {
    return <Loading />;
  }

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
            <Chart1
              typeCharts={typeCharts}
              times={times}
              colors={colors}
              handleDownload={handleDownload}
            />
            <Chart2
              typeCharts={typeCharts}
              times={times}
              colors={colors}
              handleDownload={handleDownload}
            />
            <Chart3
              typeCharts={typeCharts}
              times={times}
              colors={colors}
              handleDownload={handleDownload}
            />
            <Chart4
              typeCharts={typeCharts}
              times={times}
              colors={colors}
              handleDownload={handleDownload}
            />
            <Chart5
              typeCharts={typeCharts}
              times={times}
              colors={colors}
              handleDownload={handleDownload}
            />
            <Chart6
              typeCharts={typeCharts}
              times={times}
              colors={colors}
              handleDownload={handleDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
