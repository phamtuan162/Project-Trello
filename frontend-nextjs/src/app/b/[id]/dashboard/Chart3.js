"use client";
import { useSelector } from "react-redux";
import { Chart } from "chart.js/auto";
import { useRef, useEffect, useMemo, useState } from "react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { checkCardCreationDate } from "@/utils/formatTime";
import { format } from "date-fns";
const colors = [
  "rgba(75, 192, 192, 0.8)",
  "rgba(255, 205, 86, 0.8)",
  "rgba(255, 159, 64, 0.8)",
  "rgba(255, 99, 132, 0.8)",
  "rgba(201, 203, 207, 0.8)",
];
const status = [
  {
    label: "Hoàn tất",
    value: "success",
  },
  {
    label: "Sắp hết hạn",
    value: "up_expired",
  },
  {
    label: "Hết hạn sau",
    value: "pending",
  },
  {
    label: "Quá hạn",
    value: "expired",
  },
  {
    label: "Không có ngày hết hạn",
    value: null,
  },
];
const Chart3 = ({ typeCharts, times, handleDownload }) => {
  const chartRef = useRef(null);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const [type, setType] = useState("bar");
  const [selected, setSelected] = useState("month");

  const updatedBoard = useMemo(() => {
    const updatedColumns = board?.columns?.map((column) => {
      if (column?.cards?.length > 0) {
        const updatedCards = column.cards.map((item) =>
          +item.id === +card?.id ? card : item
        );
        return { ...column, cards: updatedCards };
      }
      return column;
    });
    return { ...board, columns: updatedColumns };
  }, [card, board]);

  const check = useMemo(
    () =>
      updatedBoard?.columns?.some((column) => column?.cards?.length > 0) ||
      false,
    [updatedBoard]
  );

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    const context = chartRef.current.getContext("2d");
    let chartData = {};

    if (type === "line") {
      const timeCreates = [];
      const datasets = status.map((item, index) => ({
        label: item.label,
        data: [],
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        fill: false,
      }));

      updatedBoard.columns.forEach((column) => {
        column.cards.forEach((card) => {
          if (card.created_at) {
            const created_at = format(new Date(card.created_at), "dd/MM/yyyy");
            if (
              checkCardCreationDate(selected, card.created_at) &&
              !timeCreates.includes(created_at)
            ) {
              timeCreates.push(created_at);
            }
          }
        });
      });

      timeCreates.sort(
        (a, b) =>
          new Date(a.split("/").reverse().join("/")) -
          new Date(b.split("/").reverse().join("/"))
      );

      const cardCounts = Array(timeCreates.length).fill(0);

      updatedBoard.columns.forEach((column) => {
        column.cards.forEach((card) => {
          if (card.created_at) {
            const created_at = format(new Date(card.created_at), "dd/MM/yyyy");
            const timeIndex = timeCreates.indexOf(created_at);
            if (timeIndex !== -1) {
              const statusIndex = status.findIndex(
                (item) => item.value === card.status
              );
              if (statusIndex !== -1) {
                datasets[statusIndex].data[timeIndex] =
                  (datasets[statusIndex].data[timeIndex] || 0) + 1;
              }
            }
          }
        });
      });

      chartData = {
        type,
        data: { labels: timeCreates, datasets },
        options: {
          responsive: true,
          scales: {
            x: { type: "category" },
            y: { beginAtZero: true },
          },
        },
      };
    } else {
      const cards = [0, 0, 0, 0, 0];
      let backgroundColors = [];
      let borderColors = [];
      updatedBoard.columns.forEach((column) => {
        column?.cards?.forEach((card) => {
          const statusIndex = card.endDateTime
            ? status.findIndex((item) => item.value === card.status)
            : 4;
          if (statusIndex !== -1) cards[statusIndex] += 1;
        });
      });

      status.forEach((_, index) => {
        const color = colors[index % colors.length];
        backgroundColors.push(color);
        borderColors.push(color);
      });

      const chartOptions =
        type === "pie"
          ? null
          : {
              scales: {
                x: { type: "category" },
                y: { beginAtZero: true },
              },
            };

      chartData = {
        type,
        data: {
          labels: status.map((item) => item.label),
          datasets: [
            {
              label: "Số thẻ ",
              data: cards,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        },
        options: chartOptions,
      };
    }

    const newChart = new Chart(context, chartData);
    chartRef.current.chart = newChart;
  }, [updatedBoard, type, selected]);

  const handleSelectTypeChart = (typeChart) => {
    if (type !== typeChart) {
      setType(typeChart);
    }
  };
  return (
    <div
      className="group p-4 rounded-lg bg-white flex flex-col"
      style={{
        boxShadow:
          "0 3px 5px rgba(9, 30, 66, 0.2), 0 0 1px rgba(9, 30, 66, 0.31)",
      }}
    >
      <div
        className="w-full flex items-center justify-between"
        style={{ color: "#172b4d" }}
      >
        <p className="font-bold">Số thẻ mỗi ngày hết hạn</p>
        <div className="flex gap-1">
          {typeCharts.map((typeChart, index) => (
            <div
              onClick={() => handleSelectTypeChart(typeChart.type)}
              key={index}
              className={`p-1 w-[70px] cursor-pointer border-2 border-solid ${
                typeChart.type === type
                  ? "border-blue-400"
                  : "border-default-200"
              }  rounded-lg flex flex-col gap-1 items-center`}
            >
              <img
                src={
                  typeChart.type === type ? typeChart.imgFocus : typeChart.img
                }
                className="w-[24px] h-[24px]"
              />
              <p style={{ fontSize: "6px" }} className="font-bold">
                {typeChart.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full grow flex flex-col justify-end">
        {type === "line" && (
          <RadioGroup
            label="Khung thời gian"
            value={selected}
            onValueChange={setSelected}
            orientation="horizontal"
            className="radio "
          >
            {times.map((time) => (
              <Radio value={time.value}>{time.label}</Radio>
            ))}
          </RadioGroup>
        )}
        <div className="w-full  hidden last:flex items-center justify-center flex-col gap-2">
          <img
            src="https://trello.com/assets/ef769d2a141355c08d0e.png"
            alt=""
            className="w-[200px] h-[200px]"
          />
          <p className=" text-lg  text-muted-foreground">
            Bảng này chưa có thẻ nào có ngày hết hạn.
          </p>
        </div>
        {check ? (
          <canvas
            className="w-full  grow h-full max-h-[300px]"
            ref={chartRef}
          />
        ) : (
          ""
        )}
        {check && (
          <div className="w-full  flex items-end justify-center  mt-2">
            <button
              onClick={() => handleDownload(chartRef, type)}
              className="mt-auto rounded-md bg-amber-600 bg-opacity-25 p-1 px-4 font-medium  border border-amber-800"
            >
              Tải ảnh về
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Chart3;
