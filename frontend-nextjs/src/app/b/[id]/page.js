"use client";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
  updateBoardDetail,
  updateColumnDetail,
  moveCardToDifferentColumnAPI,
  createColumn,
  createCard,
} from "@/services/workspaceApi";
import { mapOrder } from "@/utils/sorts";
import { generatePlaceholderCard } from "@/utils/formatters";
import { ListContainer } from "./_components/ListContainer";
import Loading from "@/components/Loading/Loading";
import { boardSlice } from "@/stores/slices/boardSlice";
import { cardSlice } from "@/stores/slices/cardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
const { updateCard } = cardSlice.actions;
export default function BoardIdPage() {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board.board);
  const workspace = useSelector((state) => state.workspace.workspace);
  const card = useSelector((state) => state.card.card);
  const { id: boardId } = useParams();

  const moveColumns = async (dndOrderedColumns) => {
    const newBoard = {
      ...board,
      columns: [...dndOrderedColumns],
      columnOrderIds: dndOrderedColumns.map((c) => c.id),
    };
    dispatch(boardSlice.actions.updateBoard(newBoard));
    try {
      const data = await updateBoardDetail(newBoard.id, {
        columnOrderIds: newBoard.columnOrderIds,
      });
      if (data.status === 200) {
      } else {
        toast.error(data.error);
        document.location.href = `/b/${board.id}`;
      }
    } catch (error) {
      console.error("Error moving columns:", error);
    }
  };

  const moveCardInTheSameColumn = async (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    const updatedColumns = board.columns.map((column) =>
      column.id === columnId
        ? { ...column, cards: dndOrderedCards, cardOrderIds: dndOrderedCardIds }
        : column
    );

    const newBoard = { ...board, columns: updatedColumns };
    dispatch(boardSlice.actions.updateBoard(newBoard));
    try {
      const data = await updateColumnDetail(columnId, {
        cardOrderIds: dndOrderedCardIds,
      });
      if (data.status === 200) {
      } else {
        toast.error(data.error);
        document.location.href = `/b/${board.id}`;
      }
    } catch (error) {
      console.error("Error moving card in the same column:", error);
    }
  };

  const moveCardToDifferentColumn = async (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const newBoard = {
      ...board,
      columns: [...dndOrderedColumns],
      columnOrderIds: dndOrderedColumns.map((c) => c.id),
    };

    dispatch(boardSlice.actions.updateBoard(newBoard));

    const updatedColumns = newBoard.columns.map((column) =>
      column.cardOrderIds.includes("placeholder-card")
        ? { ...column, cardOrderIds: [], cards: [] }
        : column
    );

    const updatedBoard = { ...newBoard, columns: updatedColumns };

    try {
      const data = await moveCardToDifferentColumnAPI({
        updateBoard: updatedBoard,
        card_id: currentCardId,
        prevColumnId: prevColumnId,
        nextColumnId: nextColumnId,
      });
      if (data.status === 200) {
        const updatedCard = {
          ...card,
          activities:
            card.activities.length > 0
              ? [data.data, ...card.activities]
              : [data.data],
        };
        dispatch(updateCard(updatedCard));
      } else {
        document.location.href = `/b/${board.id}`;
      }
    } catch (error) {
      console.error("Error moving card to different column:", error);
    }
  };

  const createNewColumn = async (newColumnData) => {
    try {
      const data = await createColumn({ ...newColumnData, board_id: board.id });
      if (data.status === 200) {
        const createdColumn = data.data;
        const placeholderCard = generatePlaceholderCard(createdColumn);
        createdColumn.cards = [placeholderCard];
        createdColumn.cardOrderIds = [placeholderCard.id];

        const newColumns = [...board.columns, createdColumn];
        const newBoard = { ...board, columns: newColumns };

        dispatch(boardSlice.actions.updateBoard(newBoard));
        toast.success("Tạo danh sách thành công");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error creating new column:", error);
    }
  };

  const updateColumn = async (columnId, updateData) => {
    try {
      const data = await updateColumnDetail(columnId, updateData);
      if (data.status === 200) {
        const updatedColumn = data.data;
        const updatedColumns = board.columns.map((column) =>
          column.id === updatedColumn.id ? updatedColumn : column
        );

        const updatedBoard = {
          ...board,
          columns: updatedColumns.map((column) => {
            if (column.id === columnId) {
              return {
                ...column,
                cards: mapOrder(column.cards, column.cardOrderIds, "id"),
              };
            }
            return column;
          }),
        };

        dispatch(boardSlice.actions.updateBoard(updatedBoard));
        toast.success("Cập nhật thành công");
        dispatch(columnSlice.actions.updateColumn(updatedColumns));
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error updating column:", error);
    }
  };

  const createNewCard = async (newCardData, columnId) => {
    try {
      const data = await createCard({
        ...newCardData,
        workspace_id: workspace.id,
        column_id: columnId,
      });

      if (data.status === 200) {
        const createdCard = data.data;
        const updatedColumns = board.columns.map((column) => {
          if (+column.id === +columnId) {
            const isPlaceholderExist = column.cards.some(
              (card) => card.FE_PlaceholderCard
            );
            return {
              ...column,
              cards: isPlaceholderExist
                ? [createdCard]
                : [...column.cards, createdCard],
              cardOrderIds: isPlaceholderExist
                ? [createdCard.id]
                : [...column.cardOrderIds, createdCard.id],
            };
          }
          return column;
        });

        const updatedBoard = { ...board, columns: updatedColumns };
        dispatch(boardSlice.actions.updateBoard(updatedBoard));
        toast.success("Tạo thẻ thành công");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error creating new card:", error);
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
          <ListContainer
            board={board}
            boardId={boardId}
            moveColumns={moveColumns}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferentColumn={moveCardToDifferentColumn}
            createNewColumn={createNewColumn}
            createNewCard={createNewCard}
            updateColumn={updateColumn}
          />
        </div>
      </div>
    </div>
  );
}
