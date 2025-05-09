"use client";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, Button } from "@nextui-org/react";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import SetDateCard from "@/components/actions/card/setDateCard";
import { cn } from "@/lib/utils";
import { updateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { getStatusByDate } from "@/utils/formatTime";
import { socket } from "@/socket";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const DateCard = ({ checkRole }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);

  const statusCard = Boolean(card?.status === "success");

  const HandleChangeStatusDate = async (selected) => {
    const status = selected ? "success" : getStatusByDate(card.endDateTime);

    await toast
      .promise(async () => await updateCardApi(card.id, { status }), {
        pending: "Đang cập nhật...",
      })
      .then((res) => {
        const cardUpdate = { id: card.id, column_id: card.column_id, status };

        dispatch(updateCard(cardUpdate));

        dispatch(updateCardInBoard(cardUpdate));

        toast.success("Cập nhật thành công");

        socket.emit("updateCard", cardUpdate);
      })
      .catch((error) => {
        setIsSelected(false);
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col">
      <p
        className="text-xs font-medium text-neutral-700 mb-2"
        style={{ color: "#44546f" }}
      >
        Ngày
      </p>
      <div className="items-center flex gap-2 cursor-pointer text-xs grow font-medium">
        {checkRole && (
          <Checkbox
            isSelected={statusCard}
            value={statusCard}
            onValueChange={(selected) => HandleChangeStatusDate(selected)}
            classNames={{
              base: cn("inline-flex max-w-md w-3  bg-content1 m-0 p-0 mr-2"),
            }}
          ></Checkbox>
        )}

        <SetDateCard>
          <Button
            className="items-center flex p-1 h-full  px-2 bg-gray-200 text-xs font-medium"
            style={{ color: "#172b4d" }}
          >
            {card?.startDateTime && (
              <>
                {format(card?.startDateTime, "d 'tháng' M")}
                {card?.endDateTime && " - "}
              </>
            )}
            {card?.endDateTime &&
              format(card?.endDateTime, "d 'tháng' M 'lúc' HH':'mm")}
            {statusCard ? (
              <span className="px-1 rounded-sm h-[20px] bg-green-700 text-white font-medium text-xs flex items-center">
                Hoàn tất
              </span>
            ) : (
              <>
                {card?.status === "expired" && (
                  <span className="px-1 rounded-sm h-[20px] bg-red-700 text-white font-medium text-xs flex items-center">
                    Hết hạn
                  </span>
                )}
                {card?.status === "up_expired" && (
                  <span className="px-1 rounded-sm h-[20px] bg-yellow-400 text-white font-medium text-xs flex items-center">
                    Sắp hết hạn
                  </span>
                )}
              </>
            )}

            <ChevronDown size={15} />
          </Button>
        </SetDateCard>
      </div>
    </div>
  );
};
export default DateCard;
