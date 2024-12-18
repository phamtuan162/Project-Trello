"use client";
import { Layout } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { updateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const TitleModal = () => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const inputRef = useRef(null);
  const btnRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onUpdateTitle = async () => {
    try {
      const title = inputRef.current.value.trim();

      if (title.length < 6) {
        toast.info("Tiêu đề ít nhất 6 ký tụ!");
        return;
      }

      if (title === card.title.trim()) {
        setIsEditing(false);
        return;
      }

      await toast
        .promise(async () => await updateCardApi(card.id, { title: title }), {
          pending: "Đang cập nhật...",
        })
        .then(async (res) => {
          toast.success("Cập nhật thành công");
          dispatch(updateCard({ title: title }));
          dispatch(
            updateCardInBoard({
              id: card.id,
              column_id: card.column_id,
              title: title,
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      inputRef.current.blur();
    }
  };

  return (
    <div className="flex items-start gap-x-3  w-full flex mt-2">
      <Layout className=" mt-2.5 text-neutral-700" size={24} />
      <div className="w-full flex flex-col items-start ">
        {isEditing ? (
          <>
            <input
              defaultValue={card?.title}
              className=" rounded-md focus-visible:outline-none border-sky-600 h-full font-bold text-lg p-2 w-3/4 h-[44px] border-2 "
              onBlur={() => onUpdateTitle()}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              size="xs"
            />
          </>
        ) : (
          <span
            ref={btnRef}
            variant="transparent"
            className="font-bold text-lg  block p-2 border-2 border-white h-[44px] flex items-center"
            onClick={() => setIsEditing(!isEditing)}
          >
            {card?.title}
          </span>
        )}

        <p className="text-sm text-muted-foreground pl-2">
          trong danh sách
          <span className="underline ml-1">{card?.column?.title}</span>
        </p>
      </div>
    </div>
  );
};
export default TitleModal;
