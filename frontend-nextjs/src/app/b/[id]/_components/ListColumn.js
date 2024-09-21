"use client";
import { Column } from "./Column";
import { ListForm } from "./ListForm";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

export function ListColumn({
  columns,

  createNewColumn,
  createNewCard,
  updateColumn,
}) {
  return (
    <ol className="flex gap-x-3 h-full">
      <SortableContext
        items={columns?.map((c) => c.id) || []}
        strategy={horizontalListSortingStrategy}
      >
        {columns?.map((column) => (
          <Column
            column={column}
            key={column.id}
            createNewCard={createNewCard}
            updateColumn={updateColumn}
          />
        ))}
      </SortableContext>
      <ListForm createNewColumn={createNewColumn} />
      <div className="flex-shrink-0 w-1" />
    </ol>
  );
}
