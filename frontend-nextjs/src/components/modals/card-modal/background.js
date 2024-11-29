"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Image } from "lucide-react";
import { toast } from "react-toastify";

import FormBackground from "@/components/Form/FormBackground";
import { updateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { singleFileValidator } from "@/utils/validators";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const BackgroundCard = () => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);

  const HandleBackground = async (data) => {
    let reqData;
    let isFile;
    try {
      // Kiểm tra xem dữ liệu là FormData hay e.target.files
      if (data instanceof FormData) {
        // Trường hợp FormData
        const image = data.get("image");
        if (image) {
          reqData = { background: image };
        } else {
          toast.error("Hình ảnh không hợp lệ.");
          return;
        }
      } else if (data?.target?.files) {
        isFile = true;
        // Trường hợp e.target.files
        const file = data.target.files[0];

        // Kiểm tra tính hợp lệ của file
        const validationError = singleFileValidator(file);
        if (validationError) {
          toast.error(validationError);
          return;
        }

        reqData = new FormData();
        reqData.append("cardCover", file);
      }

      if (!reqData) {
        toast.error("Không có dữ liệu để cập nhật.");
        return;
      }

      await toast
        .promise(async () => await updateCardApi(card.id, reqData), {
          pending: "Đang cập nhật...",
        })
        .then((res) => {
          const { data } = res;

          dispatch(updateCard({ background: data.background }));
          dispatch(
            updateCardInBoard({
              id: card.id,
              column_id: card.column_id,
              background: data.background,
            })
          );
          toast.success("Cập nhật thành công");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          if (isFile) data.target.value = "";
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="card-background-modal w-full min-h-[200px] h-[160px] overflow-hidden bg-no-repeat relative bg-cover bg-origin-content p-0 bg-center rounded-t-md"
      style={{ backgroundImage: `url(${card.background})` }}
    >
      <div className=" flex items-center justify-end absolute w-full p-2 bottom-0">
        <FormBackground
          placement={"left"}
          HandleBackground={HandleBackground}
          isCardActive={true}
        >
          <span className="window-cover-menu-button    rounded-md text-sm px-2 py-1 flex gap-1 cursor-pointer items-center">
            <Image size={14} />
            Ảnh bìa
          </span>
        </FormBackground>
      </div>
    </div>
  );
};

export default BackgroundCard;
