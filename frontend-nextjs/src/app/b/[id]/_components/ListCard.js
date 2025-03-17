"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Card } from "./Card";
import { cn } from "@/lib/utils";

export function ListCard({ cards }) {
  return (
    <ol
      className={cn(
        "mx-1 px-1 py-0.5 flex flex-col gap-y-2  max-h-[280px]  overflow-y-auto rounded-t-md"
      )}
    >
      <SortableContext
        items={cards?.map((c) => c.id) || []}
        strategy={verticalListSortingStrategy}
      >
        {cards?.map((card) => (
          <Card card={card} key={card.id} />
        ))}
      </SortableContext>
    </ol>
  );
}
