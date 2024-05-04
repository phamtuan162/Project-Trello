"use client";
import { useSelector } from "react-redux";
import { Chart } from "chart.js/auto";
import { useRef, useEffect } from "react";
import { MoreHorizontalIcon } from "lucide-react";
const BarChart = ({ chart }) => {
  const chartRef = useRef(null);
  const board = useSelector((state) => state.board.board);
  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const cardCounts = board.columns.map((column) =>
        Math.round(+column.cards.length || 0)
      );
      const columnCounts = board.columns.map((column) => column.title);
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: chart.type,
        data: {
          labels: columnCounts,
          datasets: [
            {
              label: "Số thẻ ",
              data: cardCounts,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(201, 203, 207, 0.2)",
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "category",
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      chartRef.current.chart = newChart;
    }
  }, []);
  return (
    <div
      className="group p-4 rounded-lg bg-white"
      style={{
        boxShadow:
          "0 3px 5px rgba(9, 30, 66, 0.2), 0 0 1px rgba(9, 30, 66, 0.31)",
      }}
    >
      <div
        className="w-full flex items-center justify-between"
        style={{ color: "#172b4d" }}
      >
        <p className="font-bold">Số thẻ trong mỗi danh sách</p>
        <MoreHorizontalIcon size={16} />
      </div>
      <canvas className="w-full" ref={chartRef} />
    </div>
  );
};
export default BarChart;
