"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  updateBoardDetail,
  updateColumnDetail,
  moveCardToDifferentColumnAPI,
} from "@/services/workspaceApi";
import { ListContainer } from "./_components/ListContainer";
import Loading from "@/components/Loading/Loading";
import { boardSlice } from "@/stores/slices/boardSlice";
import { CardModal } from "@/components/modals/card-modal";
import { fetchBoard } from "@/stores/middleware/fetchBoard";

const { updateBoard, updateColumnInBoard, updateActivitiesOfCardInBoard } =
  boardSlice.actions;

export default function BoardIdPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const board = useSelector((state) => state.board.board);
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);

  const { id: boardId } = useParams();

  useEffect(() => {
    if (!boardId || !user?.id || !workspace?.id) return;

    // Chỉ gọi dispatch nếu board chưa được tải hoặc board id không khớp với boardId
    if (!board?.id) {
      dispatch(fetchBoard({ boardId, router }));
    }
  }, [boardId, user, workspace]);

  const moveColumns = async (dndOrderedColumns) => {
    try {
      const columnOrderIdsUpdate = dndOrderedColumns.map((c) => c.id);

      dispatch(
        updateBoard({
          columns: dndOrderedColumns,
          columnOrderIds: columnOrderIdsUpdate,
        })
      );

      await updateBoardDetail(board.id, {
        columnOrderIds: columnOrderIdsUpdate,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const moveCardInTheSameColumn = async (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    try {
      dispatch(
        updateColumnInBoard({
          id: columnId,
          cards: dndOrderedCards,
          cardOrderIds: dndOrderedCardIds,
        })
      );

      await updateColumnDetail(columnId, {
        cardOrderIds: dndOrderedCardIds,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const moveCardToDifferentColumn = async (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    try {
      dispatch(
        updateBoard({
          columns: dndOrderedColumns,
        })
      );

      const nextColumn = dndOrderedColumns.find((c) => c.id === nextColumnId);

      const { activity } = await moveCardToDifferentColumnAPI({
        nextColumn: nextColumn,
        card_id: currentCardId,
        prevColumnId: prevColumnId,
      });

      dispatch(
        updateActivitiesOfCardInBoard({
          card_id: activity.card_id,
          column_id: nextColumnId,
          activity,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (!board?.id || +board?.id !== +boardId) {
    return <Loading />;
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center grow overflow-x-auto"
      style={{
        backgroundImage: board?.background ? `url(${board.background})` : "",
      }}
    >
      <div className="relative pt-10 h-full ">
        <div className="p-4 h-full overflow-y-hidden ">
          <CardModal />
          <ListContainer
            board={board}
            boardId={boardId}
            moveColumns={moveColumns}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferentColumn={moveCardToDifferentColumn}
          />
        </div>
      </div>
    </div>
  );
}
