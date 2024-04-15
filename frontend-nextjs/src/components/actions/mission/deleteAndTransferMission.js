"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { deleteMissionApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
const { updateCard } = cardSlice.actions;
const DeleteAndTransferMission = ({ children, mission }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const card = useSelector((state) => state.card.card);
  const HandleDeleteMission = async () => {
    const updatedWorks = card.works.map((work) => {
      if (+work.id === +mission.work_id) {
        const updatedMissions = work.missions.filter(
          (item) => +item.id !== +mission.id
        );
        return { ...work, missions: updatedMissions };
      }
      return work;
    });
    const updatedCard = { ...card, works: updatedWorks };
    deleteMissionApi(mission.id).then((data) => {
      if (data.status === 200) {
        dispatch(updateCard(updatedCard));
        setIsOpen(false);
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
  };
  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      classNames={{
        content: ["p-0 py-2"],
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[260px]">
        <div className="w-full">
          <div className="flex justify-between items-center relative  ">
            <h1 className="grow text-center ">Thao tác Mục</h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-2 h-auto"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="mt-3">
            <div className=" p-2 hover:bg-default-200 px-3 rounded-sm">
              Chuyển sang thẻ
            </div>
            <div
              className=" p-2 hover:bg-default-200 px-3 rounded-sm"
              onClick={() => HandleDeleteMission()}
            >
              Xóa
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteAndTransferMission;
