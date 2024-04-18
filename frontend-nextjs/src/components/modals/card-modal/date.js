"use client";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, Button } from "@nextui-org/react";
import { format } from "date-fns";
import FormDate from "@/components/Form/FormDate";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { updateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { toast } from "react-toastify";

const { updateCard } = cardSlice.actions;
const DateCard = ({ checkRole }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);

  const [isSelected, setIsSelected] = useState(
    card.status === "success" && true
  );

  const HandleChangeStatusDate = async (selected) => {
    setIsSelected(selected);
    const statusCard = selected ? "success" : card.status;
    updateCardApi(card.id, { status: statusCard }).then((data) => {
      if (data.status === 200) {
        const cardUpdate = {
          ...card,
          status: statusCard,
          activities: data.data.activities,
        };
        dispatch(updateCard(cardUpdate));
      } else {
        const error = data.error;
        toast.error(error);
      }
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
            isSelected={isSelected}
            value={isSelected}
            onValueChange={(selected) => HandleChangeStatusDate(selected)}
            classNames={{
              base: cn("inline-flex max-w-md w-3  bg-content1 m-0 p-0 mr-2"),
            }}
          ></Checkbox>
        )}

        <FormDate>
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
            {isSelected ? (
              <span className="px-1 rounded-sm h-[20px] bg-green-700 text-white font-medium text-xs flex items-center">
                Hoàn tất
              </span>
            ) : (
              card.status === "expired" && (
                <span className="px-1 rounded-sm h-[20px] bg-yellow-700 text-white font-medium text-xs flex items-center">
                  Hết hạn
                </span>
              )
            )}

            <ChevronDown size={15} />
          </Button>
        </FormDate>
      </div>
    </div>
  );
};
export default DateCard;
