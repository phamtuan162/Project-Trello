"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef } from "react";
import { Input } from "@nextui-org/react";
import { ListCard } from "./ListCard";
import { ListHeader } from "./ListHeader";
import { CardForm } from "./Cardform";
export function Column({
  column,
  deleteColumnDetail,
  createNewCard,
  updateColumn,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { ...column },
  });

  const inputRef = useRef(null);
  const dndKitCommonStyle = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    listStyle: "none",
    opacity: isDragging ? 0.3 : undefined,
  };

  return (
    <li
      className="shrink-0 h-full w-[272px] select-none "
      ref={setNodeRef}
      style={dndKitCommonStyle}
      {...attributes}
      key={column.id}
    >
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2 column">
        <div {...listeners} className="h-4"></div>
        <ListHeader
          column={column}
          deleteColumnDetail={deleteColumnDetail}
          createNewCard={createNewCard}
          updateColumn={updateColumn}
        />
        <ListCard cards={column?.cards} />
        <CardForm createNewCard={createNewCard} column={column} />
      </div>
    </li>
  );
}
