"use client";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { Chart } from "chart.js/auto";
import { useRef, useEffect, useMemo, useState } from "react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { checkCardCreationDate } from "@/utils/formatTime";

const Chart5 = ({ typeCharts, times, colors }) => {
  const chartRef = useRef(null);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const workspace = useSelector((state) => state.workspace.workspace);
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

  const check = useMemo(() => {
    if (!updatedBoard || !updatedBoard.columns) return false;

    for (const column of updatedBoard.columns) {
      if (!column.cards) continue;

      for (const card of column.cards) {
        if (!card.works) continue;

        for (const work of card.works) {
          if (work.missions.length > 0) return true;
        }
      }
    }

    return false;
  }, [updatedBoard]);

  useEffect(() => {
    if (chartRef.current && workspace?.users?.length > 0 && check) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const context = chartRef.current.getContext("2d");
      let chartData = {};

      if (type === "line") {
        let timeCreates = [];
        let datasets = [];
        let missionCounts = [];
        let users = ["Không được giao"];
        updatedBoard?.columns?.forEach((column) => {
          if (column.cards.length > 0) {
            column.cards.forEach((card) => {
              if (card.works.length > 0) {
                for (const work of card.works) {
                  if (work.missions.length > 0) {
                    work.missions.forEach((mission) => {
                      if (
                        checkCardCreationDate(selected, mission.created_at) &&
                        mission.created_at
                      ) {
                        if (mission.user_id) {
                          const user = workspace?.users?.find(
                            (user) => +user.id === +mission.user_id
                          );
                          if (!users.includes(user.name)) {
                            users.push(user.name);
                          }
                        }
                        const created_at = format(
                          new Date(mission.created_at),
                          "dd/MM/yyyy"
                        );
                        if (!timeCreates.includes(created_at)) {
                          timeCreates.push(created_at);
                          missionCounts.push(0);
                        }
                      }
                    });
                  }
                }
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
              data: [...missionCounts],
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              fill: false,
            });
          });
        }

        updatedBoard?.columns?.forEach((column) => {
          if (column.cards.length > 0) {
            column.cards.forEach((card) => {
              if (card.works.length > 0) {
                for (const work of card.works) {
                  if (work.missions.length > 0) {
                    work.missions.forEach((mission) => {
                      if (mission.created_at) {
                        const created_at = format(
                          new Date(mission.created_at),
                          "dd/MM/yyyy"
                        );
                        const user = mission.user_id
                          ? workspace?.users?.find(
                              (user) => +user.id === +mission.user_id
                            )
                          : { name: "Không được giao" };
                        if (timeCreates.includes(created_at)) {
                          const dataset = datasets.find(
                            (item) => item.label === user.name
                          );
                          const indexTime = timeCreates.findIndex(
                            (item) => item === created_at
                          );
                          dataset.data[indexTime] += 1;
                        }
                      }
                    });
                  }
                }
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
        let users = ["Không được giao"];
        let missions = [0];
        let backgroundColors = [];
        let borderColors = [];
        updatedBoard?.columns?.forEach((column) => {
          if (column?.cards?.length > 0) {
            for (const card of column.cards) {
              if (card.works.length > 0) {
                for (const work of card.works) {
                  if (work.missions.length > 0) {
                    work.missions.forEach((mission) => {
                      if (mission.user_id) {
                        const user = workspace?.users?.find(
                          (user) => +user.id === +mission.user_id
                        );
                        if (!users.includes(user.name)) {
                          users.unshift(user.name);
                          missions.unshift(1);
                        } else {
                          const index = users.findIndex(
                            (item) => item === user.name
                          );
                          missions[index] += 1;
                        }
                      } else {
                        const index = users.findIndex(
                          (item) => item === "Không được giao"
                        );
                        missions[index] += 1;
                      }
                    });
                  }
                }
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
                label: "Số nhiệm vụ ",
                data: missions,
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
  }, [updatedBoard, type, selected, workspace]);

  const handleDownload = () => {
    if (chartRef.current) {
      const file = chartRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = file;
      link.download = `${type}Chart.png`;
      link.click();
    }
  };

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
        <p className="font-bold">Số nhiệm vụ mỗi thành viên</p>
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
            Bảng này chưa có nhiệm vụ nào
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
              onClick={handleDownload}
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
export default Chart5;
