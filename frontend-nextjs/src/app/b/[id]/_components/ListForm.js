"use client";
import { AddIcon } from "@/components/Icon/AddIcon";
export function ListForm() {
  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <button className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm">
        <AddIcon />
        <span className="ml-2">Thêm danh sách khác</span>
      </button>
    </li>
  );
}
