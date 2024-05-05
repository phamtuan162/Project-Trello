"use client";
import { useSelector } from "react-redux";
import { Chart } from "chart.js/auto";
import { useRef, useEffect, useMemo } from "react";
import { MoreHorizontalIcon } from "lucide-react";
const Chart2 = () => {
  const chartRef = useRef(null);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const updatedBoard = useMemo(() => {
    const updatedColumns = board?.columns?.map((column) => {
      if (column?.cards?.length > 0) {
        const updatedCards = column.cards.map((item) =>
          +item.id === +card.id ? card : item
        );
        return { ...column, cards: updatedCards };
      }
      return column;
    });
    return { ...board, columns: updatedColumns };
  }, [card, board]);
  const check = useMemo(
    () =>
      updatedBoard?.columns?.some((column) => column.cards.length > 0) || false,
    [updatedBoard]
  );

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      let users = [];
      let cards = [];
      updatedBoard?.columns?.forEach((column) => {
        if (column?.cards?.length > 0) {
          for (const card of column.cards) {
            if (card?.users?.length > 0) {
              for (const user of card.users) {
                if (!users.includes(user.name)) {
                  users.unshift(user.name);
                  cards.unshift(1);
                } else {
                  const index = users.findIndex((item) => item === user.name);
                  cards[index] += 1;
                }
              }
            }
            if (!users.includes("Không được giao")) {
              users.push("Không được giao");
              cards.push(1);
            } else {
              const index = users.findIndex(
                (item) => item === "Không được giao"
              );
              cards[index] += 1;
            }
          }
        }
      });
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "bar",
        data: {
          labels: users,
          datasets: [
            {
              label: "Số thẻ ",
              data: cards,
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
  }, [updatedBoard]);
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
        <p className="font-bold">Số thẻ mỗi thành viên</p>
        <MoreHorizontalIcon size={16} />
      </div>
      <div className="w-full">
        <div className="w-full  hidden last:flex items-center justify-center flex-col gap-2">
          <img
            src="https://trello.com/assets/58551b69c73b0c3abe12.png"
            alt=""
            className="w-[200px] h-[200px]"
          />
          <p className=" text-lg  text-muted-foreground">
            Bảng này chưa có thẻ nào
          </p>
        </div>
        {check ? <canvas className="w-full" ref={chartRef} /> : ""}
      </div>
    </div>
  );
};
export default Chart2;
