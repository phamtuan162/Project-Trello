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
import { cloneDeep } from "lodash";

import { CloseIcon } from "@/components/Icon/CloseIcon";
import { deleteMissionApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { missionSlice } from "@/stores/slices/missionSlice";
import { transferCardApi } from "@/services/workspaceApi";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard, createCardInBoard } = boardSlice.actions;
const { deleteMissionInMissions } = missionSlice.actions;

const DeleteAndTransferMission = ({ children, mission }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const card = useSelector((state) => state.card.card);

  const HandleDeleteMission = async () => {
    await toast
      .promise(async () => await deleteMissionApi(mission.id), {
        pending: "Đang xóa...",
      })
      .then((res) => {
        const works = cloneDeep(card.works);

        const work = works.find((w) => w.id === mission.work_id);

        if (work) {
          work.missions = work.missions.filter((m) => m.id !== mission.id);
        }

        dispatch(updateCard({ id: card.id, works }));

        dispatch(
          updateCardInBoard({ id: card.id, column_id: card.column_id, works })
        );

        if (mission.user_id === user.id) {
          dispatch(deleteMissionInMissions(mission));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsOpen(false);
      });
  };

  const HandleTransferCard = async () => {
    try {
      await toast
        .promise(
          async () =>
            await transferCardApi(mission.id, {
              column_id: card.column_id,
            }),
          { pending: "Đang chuyển..." }
        )
        .then((res) => {
          const { data: cardCreated } = res;
          const works = cloneDeep(card.works);

          const work = works.find((w) => w.id === mission.work_id);

          if (work) {
            work.missions = work.missions.filter((m) => m.id !== mission.id);
          }

          dispatch(updateCard({ id: card.id, works }));

          dispatch(
            updateCardInBoard({ id: card.id, column_id: card.column_id, works })
          );

          dispatch(createCardInBoard(cardCreated));

          if (mission.user_id === user.id) {
            dispatch(deleteMissionInMissions(mission));
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsOpen(false);
        });
    } catch (error) {
      console.log(error);
    }
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
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-2 h-auto interceptor-loading"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="mt-3">
            <div
              className=" p-2 hover:bg-default-200 px-3 rounded-sm cursor-pointer interceptor-loading"
              onClick={() => HandleTransferCard()}
            >
              Chuyển sang thẻ
            </div>
            <div
              className=" p-2 hover:bg-default-200 px-3 rounded-sm cursor-pointer interceptor-loading"
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
