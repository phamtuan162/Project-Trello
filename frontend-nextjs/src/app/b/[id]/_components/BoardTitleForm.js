"use client";
import { Button } from "@nextui-org/button";
export function BoardTitleForm({ data }) {
  return (
    <Button
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {data.title}
    </Button>
  );
}
