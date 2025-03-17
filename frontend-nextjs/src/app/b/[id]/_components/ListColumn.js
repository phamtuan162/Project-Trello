"use client";
import { useMediaQuery } from "react-responsive";
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Column } from "./Column";
import { ListForm } from "./ListForm";

export function ListColumn({ columns }) {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  return (
    <ol className="flex gap-x-3 h-full sm:flex-row  flex-col gap-y-2 overflow-y-auto items-center">
      <SortableContext
        items={columns?.map((c) => c.id) || []}
        strategy={
          isMobile ? verticalListSortingStrategy : horizontalListSortingStrategy
        }
      >
        {columns?.map((column) => (
          <Column column={column} key={column.id} />
        ))}
      </SortableContext>
      <ListForm />
      <div className="flex-shrink-0 w-1" />
    </ol>
  );
}
