"use client";
import { useSelector, useDispatch } from "react-redux";
import { Image } from "lucide-react";
import { toast } from "react-toastify";

import FormBackground from "@/components/Form/FormBackground";
import { normalizeURL } from "@/utils/normalize";
import { updateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { singleFileValidator } from "@/utils/validators";
import { socket } from "@/socket";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const BackgroundCard = () => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);

  const HandleBackground = async (data) => {
    try {
      let reqData;
      const isFileInput = data?.target?.files;

      // Xử lý dữ liệu FormData hoặc File
      if (data instanceof FormData) {
        const image = data.get("image");

        if (
          card?.background &&
          normalizeURL(image) === normalizeURL(card.background)
        ) {
          return;
        }

        if (!image) {
          toast.error("Hình ảnh không hợp lệ.");
          return;
        }
        reqData = { background: image };
      } else if (isFileInput) {
        const file = data.target.files[0];
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

      // Gửi yêu cầu cập nhật
      await toast
        .promise(updateCardApi(card.id, reqData), {
          pending: "Đang cập nhật...",
        })
        .then((res) => {
          const { data } = res;

          const cardUpdate = {
            id: card.id,
            column_id: card.column_id,
            background: data.background,
          };

          dispatch(updateCard(cardUpdate));

          dispatch(updateCardInBoard(cardUpdate));

          toast.success("Cập nhật thành công");

          socket.emit("updateCard", cardUpdate);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          if (isFileInput) data.target.value = "";
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="card-background-modal w-full min-h-[200px] h-[160px] overflow-hidden bg-no-repeat relative bg-cover bg-origin-content p-0 bg-center rounded-t-md"
      style={{ backgroundImage: card?.background && `url(${card.background})` }}
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
