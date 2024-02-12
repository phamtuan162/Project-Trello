"use client";
import { useParams } from "next/navigation";
import { ListContainer } from "./_components/ListContainer";
export default function BoardIdPage() {
  const { id: boardId } = useParams();
  const columns = [
    {
      board_id: 1,
      id: 1,
      title: "Tiêu đề 1",
      cards: [
        { column_id: 1, id: 1, title: "Tiêu đề 1" },
        { column_id: 1, id: 2, title: "Tiêu đề 2" },
        { column_id: 1, id: 3, title: "Tiêu đề 3" },
      ],
    },
    {
      board_id: 1,
      id: 2,
      title: "Tiêu đề 2",
      cards: [
        { column_id: 2, id: 4, title: "Tiêu đề 1" },
        { column_id: 2, id: 5, title: "Tiêu đề 2" },
        { column_id: 2, id: 6, title: "Tiêu đề 3" },
      ],
    },
    {
      board_id: 1,
      id: 3,
      title: "Tiêu đề 3",
      cards: [
        { column_id: 3, id: 7, title: "Tiêu đề 1" },
        { column_id: 3, id: 8, title: "Tiêu đề 2" },
        { column_id: 3, id: 9, title: "Tiêu đề 3" },
      ],
    },
  ];
  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer columns={columns} boardId={boardId} />
    </div>
  );
}
