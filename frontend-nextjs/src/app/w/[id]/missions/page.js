"use client";
import { useState } from "react";
import { RadioGroup, Radio, Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { useMemo } from "react";

import MissionList from "./mission-list";

const statusOptions = [
  { name: "Tất cả", value: "all" },
  { name: "Hoàn thành", value: "success" },
  { name: "Sắp hết hạn", value: "imminent" },
  { name: "Hết hạn", value: "expired" },
];

export default function MissionsWorkspace() {
  const missionsActive = useSelector((state) => state.mission.missions);
  const workspace = useSelector((state) => state.workspace.workspace);
  const [filterValue, setFilterValue] = useState("");
  const [selected, setSelected] = useState("all");

  const hasSearchFilter = Boolean(filterValue);

  const missionsSort = useMemo(() => {
    return missionsActive.filter((item) => item.card_id) || [];
  }, [missionsActive]);

  const filteredItems = useMemo(() => {
    let filteredMissions =
      missionsSort?.filter(
        (mission) => mission !== null && mission !== undefined
      ) || [];
    if (hasSearchFilter) {
      const filterBoards = workspace.boards.filter((board) =>
        board.title.toLowerCase().includes(filterValue.toLowerCase())
      );
      filteredMissions = filteredMissions.filter((mission) =>
        filterBoards.find((board) => +board.id === +mission.board_id)
      );
    }
    if (selected !== "all") {
      filteredMissions = filteredMissions.filter(
        (mission) => selected.toLowerCase() === mission.status
      );
    }
    return filteredMissions;
  }, [missionsSort, filterValue, selected]);

  return (
    <div className="h-full ">
      <h1 className="text-xl font-medium mt-4">Nhiệm vụ</h1>
      <p className="mt-1">
        Trang này cho phép bạn xem các nhiệm vụ của bản thân trong không gian
        làm việc này và tìm kiếm các nhiệm vụ theo tên và các tiêu chí khác.
      </p>
      <Input
        classNames={{
          base: "w-full sm:max-w-[44%] mt-3",
          inputWrapper: "border-1",
        }}
        placeholder="Tìm kiếm bằng tên Bảng..."
        size="xs"
        type="search"
        startContent={<SearchIcon className="text-default-300" />}
        value={filterValue}
        variant="bordered"
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <RadioGroup
        label="Sắp xếp"
        orientation="horizontal"
        className="mt-3"
        value={selected}
        onValueChange={setSelected}
      >
        {statusOptions.map((option) => (
          <Radio className="tex-xs" value={option.value} key={option.value}>
            {option.name}
          </Radio>
        ))}
      </RadioGroup>
      <MissionList missions={filteredItems} />
    </div>
  );
}
