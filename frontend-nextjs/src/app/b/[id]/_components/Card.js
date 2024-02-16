"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  return (
    <div
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      key={card.id}
      role="button"
      className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
    >
      {card.title}
    </div>
  );
}
