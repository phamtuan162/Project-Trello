"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ListCard } from "./ListCard";
import { ListHeader } from "./ListHeader";
export function Column({ column }) {
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
  const dndKitCommonStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    listStyle: "none",
    opacity: isDragging ? 0.3 : undefined,
  };

  return (
    <li
      className="shrink-0 h-full w-[272px] select-none"
      ref={setNodeRef}
      style={dndKitCommonStyle}
      {...attributes}
    >
      <div
        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
        {...listeners}
      >
        <ListHeader column={column} />
        <ListCard cards={column.cards} />
      </div>
    </li>
  );
}
