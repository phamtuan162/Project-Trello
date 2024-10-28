"use client";
import { format } from "date-fns";
import { RadioGroup, Radio } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { Chart } from "chart.js/auto";
import { useRef, useEffect, useMemo, useState } from "react";
import { checkCardCreationDate } from "@/utils/formatTime";

const Chart1 = ({ typeCharts, times, colors, handleDownload }) => {
  const chartRef = useRef(null);
  const board = useSelector((state) => state.board.board);
  const check = useMemo(
    () => board?.columns?.some((column) => column.cards.length > 0) || false,
    [board]
  );
  const [type, setType] = useState("bar");
  const [selected, setSelected] = useState("month");

  useEffect(() => {
    if (chartRef.current && check) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const context = chartRef.current.getContext("2d");
      let chartData = {};
      if (type === "line") {
        let timeCreates = [];
        let datasets = [];
        let cardCounts = [];
        let columns = [];
        board.columns.forEach((column) => {
          if (column?.cards?.length > 0) {
            column.cards.forEach((card) => {
              if (
                checkCardCreationDate(selected, card.created_at) &&
                card.created_at
              ) {
                if (!columns.includes(column.title)) {
                  columns.push(column.title);
                }
                const created_at = format(
                  new Date(card.created_at),
                  "dd/MM/yyyy"
                );
                if (!timeCreates.includes(created_at)) {
                  timeCreates.push(created_at);
                  cardCounts.push(0);
                }
              }
            });
          }
        });
        if (timeCreates.length > 0) {
          timeCreates.sort(
            (a, b) =>
              new Date(a.split("/").reverse().join("/")) -
              new Date(b.split("/").reverse().join("/"))
          );
        }

        if (columns.length > 0) {
          columns.forEach((column, index) => {
            datasets.push({
              label: column,
              data: [...cardCounts],
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              fill: false,
            });
            const columnActive = board.columns.find(
              (item) => item.title === column
            );
            columnActive.cards.forEach((card) => {
              if (card.created_at) {
                const created_at = format(
                  new Date(card.created_at),
                  "dd/MM/yyyy"
                );
                if (timeCreates.includes(created_at)) {
                  const dataset = datasets.find(
                    (item) => item.label === column
                  );
                  const indexTime = timeCreates.findIndex(
                    (item) => item === created_at
                  );
                  dataset.data[indexTime] += 1;
                }
              }
            });
          });
        }

        chartData = {
          type: type,
          data: {
            labels: timeCreates,
            datasets: datasets,
          },
          options: {
            responsive: true,
            scales: {
              x: { type: "category" },
              y: { beginAtZero: true },
            },
          },
        };
      } else {
        let columns = [];
        let cardCounts = [];
        let backgroundColors = [];
        let borderColors = [];
        board.columns.forEach((column, index) => {
          if (column?.cards?.length > 0) {
            columns.unshift(column.title);
            cardCounts.unshift(column.cards.length);
            const color = colors[index % colors.length];
            backgroundColors.push(color);
            borderColors.push(color);
          }
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
          type: type,
          data: {
            labels: columns,
            datasets: [
              {
                label: "Số thẻ",
                data: cardCounts,
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
    }
  }, [board, type, selected]);

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
        <p className="font-bold">Số thẻ trong mỗi danh sách</p>

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
      <div className="w-full  grow flex flex-col justify-end">
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
            src="https://trello.com/assets/a5465d28947b51ca12ca.png"
            alt=""
            className="w-[200px] h-[200px]"
          />
          <p className=" text-lg  text-muted-foreground">
            Bảng này chưa có thẻ nào
          </p>
        </div>
        {check ? (
          <canvas className="w-full h-full grow max-h-[300px]" ref={chartRef} />
        ) : (
          ""
        )}
        {check && (
          <div className="w-full  flex items-end justify-center mt-2">
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
export default Chart1;
