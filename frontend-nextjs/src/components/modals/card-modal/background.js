"use client";
import { useSelector, useDispatch } from "react-redux";
import { Image } from "lucide-react";
import FormBackground from "@/components/Form/FormBackground";
import { updateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { toast } from "react-toastify";
const { updateCard } = cardSlice.actions;
const BackgroundCard = () => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);

  return (
    <div
      className="card-background-modal w-full min-h-[160px] h[160px] overflow-hidden bg-no-repeat relative bg-contain bg-origin-content p-0 bg-center rounded-t-md"
      style={{ backgroundImage: `url(${card.background})` }}
    >
      <div className=" flex items-center justify-end absolute w-full p-2 bottom-0">
        <FormBackground onSubmit={onSubmit}>
          <span className="window-cover-menu-button  rounded-md text-sm px-2 p-1 flex gap-1 cursor-pointer items-center">
            <Image size={14} />
            Ảnh bìa
          </span>
        </FormBackground>
      </div>
    </div>
  );
};
export default BackgroundCard;
