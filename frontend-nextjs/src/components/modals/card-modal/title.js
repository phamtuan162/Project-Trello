"use client";
import { Layout } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { updateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
const { updateCard } = cardSlice.actions;

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
    const title = inputRef.current.value.trim();

    if (title && title !== card.title.trim()) {
      updateCardApi(card.id, { title: title }).then((data) => {
        if (data.status === 200) {
          const cardUpdate = { ...card, title: title };
          dispatch(updateCard(cardUpdate));
        } else {
          const error = data.error;
          toast.error(error);
        }
      });
    }
    setIsEditing(false);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      inputRef.current.blur();
    }
  };
  return (
    <div className="flex items-start gap-x-3  w-full flex mt-2">
      <Layout className=" mt-2.5 text-neutral-700" size={20} />
      <div className="w-full flex flex-col items-start gap-1">
        {isEditing ? (
          <input
            defaultValue={card?.title}
            className=" rounded-md focus-visible:outline-none border-sky-600 h-full font-bold text-lg p-2 w-full h-[44px] border-2"
            onBlur={() => onUpdateTitle()}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            size="xs"
          />
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
