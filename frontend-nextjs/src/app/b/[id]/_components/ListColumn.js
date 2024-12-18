"use client";

import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Column } from "./Column";
import { ListForm } from "./ListForm";

export function ListColumn({ columns }) {
  return (
    <ol className="flex gap-x-3 h-full">
      <SortableContext
        items={columns?.map((c) => c.id) || []}
        strategy={horizontalListSortingStrategy}
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
