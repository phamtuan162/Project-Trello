"use client";
import { useState } from "react";
import { RadioGroup, Radio, Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useCallback } from "react";
import MissionItem from "./mission";
const statusOptions = [
  { name: "Tất cả", value: "all" },
  { name: "Hoàn thành", value: "success" },
  { name: "Sắp hết hạn", value: "imminent" },
  { name: "Hết hạn", value: "expired" },
];
export default function MissionsWorkspace() {
  const missionsActive = useSelector((state) => state.mission.missions);
  const missions = useMemo(() => {
    return missionsActive.filter((item) => item.card_id) || [];
  }, [missionsActive]);
  const workspace = useSelector((state) => state.workspace.workspace);
  const [filterValue, setFilterValue] = useState("");
  const [selected, setSelected] = useState("all");

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredMissions = missions
      ? missions.filter((mission) => mission !== null && mission !== undefined)
      : [];
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
  }, [missions, filterValue, selected]);

  return (
    <div className="h-full ">
      <h1 className="text-xl font-medium mt-4">Nhiệm vụ</h1>
      <p className="mt-1">
        Trang này cho phép bạn xem các nhiệm vụ của bản thân trong không gian
        làm việc này và tìm kiếm các nhiệm vụ theo tên và các tiêu chí khác.
      </p>
      <Input
        isClearable
        classNames={{
          base: "w-full sm:max-w-[44%] mt-3",
          inputWrapper: "border-1",
        }}
        placeholder="Tìm kiếm bằng tên Bảng..."
        size="xs"
        startContent={<SearchIcon className="text-default-300" />}
        value={filterValue}
        variant="bordered"
        onClear={() => setFilterValue("")}
        onValueChange={onSearchChange}
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
      <ol className="space-y-4 mt-4 pb-4">
        <p className="hidden last:block text-xs  text-center text-muted-foreground">
          Không có nhiệm vụ nào trong không gian làm việc
        </p>
        {filteredItems?.map((mission) => (
          <MissionItem key={mission.id} mission={mission} />
        ))}
      </ol>
    </div>
  );
}
