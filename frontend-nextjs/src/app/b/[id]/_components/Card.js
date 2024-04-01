"use client";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UserPlus } from "lucide-react";
import AssignUser from "./AssignUser";
export function Card({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { ...card },
  });
  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    display: card?.FE_PlaceholderCard ? "none" : "block",
  };
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...(isEdit ? {} : listeners)}
      key={card.id}
      role="button"
      onMouseEnter={() => setIsEdit(true)}
      onMouseLeave={() => setIsEdit(false)}
      className="truncate border-2 border-transparent py-2 px-3 text-sm bg-white rounded-md shadow-sm card relative z-45"
    >
      {card.title}
      <div
        className={`${
          !isEdit && "hidden"
        } absolute right-2 top-1/2 -translate-y-1/2 z-50`}
      >
        <AssignUser />
      </div>
    </div>
  );
}
