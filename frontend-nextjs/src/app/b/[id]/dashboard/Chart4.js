"use client";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { Chart } from "chart.js/auto";
import { useRef, useEffect, useMemo, useState } from "react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { checkCardCreationDate } from "@/utils/formatTime";

const Chart4 = ({ typeCharts, times, colors, handleDownload }) => {
  const chartRef = useRef(null);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);

  const [type, setType] = useState("bar");
  const [selected, setSelected] = useState("month");

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
      updatedBoard?.columns?.some((column) =>
        column.cards.some((card) => card?.comments?.length > 0)
      ) || false,
    [updatedBoard]
  );

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
        let commentCounts = [];
        let users = [];
        updatedBoard?.columns?.forEach((column) => {
          if (column.cards.length > 0) {
            column.cards.forEach((card) => {
              if (card.comments.length > 0) {
                card.comments.forEach((comment) => {
                  if (
                    checkCardCreationDate(selected, comment.created_at) &&
                    comment.created_at
                  ) {
                    if (!users.includes(comment.userName)) {
                      users.push(comment.userName);
                    }
                    const created_at = format(
                      new Date(comment.created_at),
                      "dd/MM/yyyy"
                    );
                    if (!timeCreates.includes(created_at)) {
                      timeCreates.push(created_at);
                      commentCounts.push(0);
                    }
                  }
                });
              }
            });
          }
        });
        timeCreates.sort(
          (a, b) =>
            new Date(a.split("/").reverse().join("/")) -
            new Date(b.split("/").reverse().join("/"))
        );
        if (users.length > 0) {
          users.forEach((user, index) => {
            datasets.push({
              label: user,
              data: [...commentCounts],
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              fill: false,
            });
          });
        }

        updatedBoard?.columns?.forEach((column) => {
          if (column?.cards?.length > 0) {
            column.cards.forEach((card) => {
              if (card?.comments?.length > 0) {
                card.comments.forEach((comment) => {
                  if (comment.created_at) {
                    const created_at = format(
                      new Date(comment.created_at),
                      "dd/MM/yyyy"
                    );
                    if (timeCreates.includes(created_at)) {
                      const dataset = datasets.find(
                        (item) => item.label === comment.userName
                      );
                      const indexTime = timeCreates.findIndex(
                        (item) => item === created_at
                      );
                      dataset.data[indexTime] += 1;
                    }
                  }
                });
              }
            });
          }
        });

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
        let users = [];
        let comments = [];
        let backgroundColors = [];
        let borderColors = [];
        updatedBoard?.columns?.forEach((column) => {
          if (column?.cards?.length > 0) {
            for (const card of column.cards) {
              if (card?.comments?.length > 0) {
                card.comments.forEach((comment) => {
                  if (!users.includes(comment.userName)) {
                    users.unshift(comment.userName);
                    comments.unshift(1);
                  } else {
                    const index = users.findIndex(
                      (item) => item === comment.userName
                    );
                    comments[index] += 1;
                  }
                });
              }
            }
          }
        });

        users.forEach((_, index) => {
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
          type: type,
          data: {
            labels: users,
            datasets: [
              {
                label: "Tổng bình luận ",
                data: comments,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                derWidth: 1,
              },
            ],
          },
          options: chartOptions,
        };
      }
      const newChart = new Chart(context, chartData);

      chartRef.current.chart = newChart;
    }
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
        <p className="font-bold">Tổng bình luận mỗi thành viên</p>
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
            src="https://trello.com/assets/58551b69c73b0c3abe12.png"
            alt=""
            className="w-[200px] h-[200px]"
          />
          <p className=" text-lg  text-muted-foreground">
            Bảng này chưa có bình luận nào
          </p>
        </div>
        {check ? (
          <canvas className="w-full h-full grow max-h-[300px]" ref={chartRef} />
        ) : (
          ""
        )}
        {check && (
          <div className="w-full  flex  justify-center mt-2">
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
export default Chart4;
