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
import { cardSlice } from "@/stores/slices/cardSlice";
import { CardModal } from "@/components/modals/card-modal";
import { fetchBoard } from "@/stores/middleware/fetchBoard";

const { updateActivityInCard } = cardSlice.actions;
const { updateBoard } = boardSlice.actions;

export default function BoardIdPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const board = useSelector((state) => state.board.board);
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);

  const { id: boardId } = useParams();

  useEffect(() => {
    if ((!board || +boardId !== +board?.id) && user?.id && workspace?.id) {
      dispatch(fetchBoard({ boardId, router }));
    }
  }, [user, workspace]);

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
      const updatedColumns = board.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            cards: dndOrderedCards,
            cardOrderIds: dndOrderedCardIds,
          };
        }
        return column;
      });

      dispatch(updateBoard({ columns: updatedColumns }));

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
      const columnOrderIdsUpdate = dndOrderedColumns.map((c) => c.id);

      dispatch(
        updateBoard({
          columns: dndOrderedColumns,
          columnOrderIds: columnOrderIdsUpdate,
        })
      );

      const nextColumn = dndOrderedColumns.find((c) => c.id === nextColumnId);

      const { activity, status } = await moveCardToDifferentColumnAPI({
        nextColumn: nextColumn,
        card_id: currentCardId,
        prevColumnId: prevColumnId,
      });

      if (200 <= status && status <= 299) {
        dispatch(updateActivityInCard(activity));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!board.id || +board.id !== +boardId) {
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
