"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ListContainer } from "./_components/ListContainer";
import { useSelector, useDispatch } from "react-redux";
import { boardSlice } from "@/stores/slices/boardSlice";
import { toast } from "react-toastify";
import {
  updateBoardDetail,
  updateColumnDetail,
  moveCardToDifferentColumnAPI,
  deleteColumn,
  createColumn,
  createCard,
} from "@/services/workspaceApi";
import { generatePlaceholderCard } from "@/utils/formatters";
import Loading from "@/components/Loading/Loading";
import { cardSlice } from "@/stores/slices/cardSlice";
const { updateCard } = cardSlice.actions;
export default function BoardIdPage() {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board.board);
  const workspace = useSelector((state) => state.workspace.workspace);
  const card = useSelector((state) => state.card.card);
  const { id: boardId } = useParams();

  const moveColumns = (dndOrderedColumns) => {
    const newBoard = { ...board };
    const newColumns = [...dndOrderedColumns];

    const dndOrderedColumnsIds = newColumns.map((c) => c.id);

    newBoard.columns = newColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;

    updateBoardDetail(newBoard.id, {
      columnOrderIds: dndOrderedColumnsIds,
    }).then((data) => {
      if (data.status === 200) {
        dispatch(boardSlice.actions.updateBoard(newBoard));
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
  };

  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    const newBoard = { ...board };
    const newColumns = [...newBoard.columns];

    const columnIndex = newColumns.findIndex(
      (column) => column.id === columnId
    );
    if (columnIndex !== -1) {
      const updatedColumn = { ...newColumns[columnIndex] };
      updatedColumn.cards = dndOrderedCards;
      updatedColumn.cardOrderIds = dndOrderedCardIds;
      newColumns[columnIndex] = updatedColumn;
      newBoard.columns = newColumns;
    }

    updateColumnDetail(columnId, { cardOrderIds: dndOrderedCardIds }).then(
      (data) => {
        if (data.status === 200) {
          dispatch(boardSlice.actions.updateBoard(newBoard));
        } else {
          const error = data.error;
          toast.error(error);
        }
      }
    );
  };

  const moveCardToDifferentColumn = async (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    try {
      const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c.id);

      const newBoard = { ...board };
      newBoard.columns = [...dndOrderedColumns];
      newBoard.columnOrderIds = dndOrderedColumnsIds;

      dispatch(boardSlice.actions.updateBoard(newBoard));

      const updatedColumns = newBoard.columns.map((column) => {
        if (
          Array.isArray(column.cardOrderIds) &&
          column.cardOrderIds.length > 0 && // Kiểm tra có phần tử trong mảng không
          typeof column.cardOrderIds[0] === "string" && // Kiểm tra phần tử đầu tiên có phải là chuỗi không
          column.cardOrderIds[0].indexOf("placeholder-card") !== -1
        ) {
          return {
            ...column,
            cardOrderIds: [],
            cards: [],
          };
        }
        return column;
      });
      const updatedBoard = { ...newBoard, columns: updatedColumns };
      const data = await moveCardToDifferentColumnAPI({
        updateBoard: updatedBoard,
        card_id: currentCardId,
        prevColumnId: prevColumnId,
        nextColumnId: nextColumnId,
      });
      if (data.status === 200) {
        dispatch(
          updateCard({
            ...card,
            activities:
              card.activities.length > 0
                ? [data.data, ...card.activities]
                : [data.data],
          })
        );
      }
    } catch (error) {
      console.error("Error move card to different column:", error);
    }
  };

  const deleteColumnDetail = async (columnId) => {
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter((c) => c.id !== columnId);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (id) => id !== columnId
    );

    deleteColumn(columnId).then(async (data) => {
      if (data.status === 200) {
        await updateBoardDetail(newBoard.id, {
          columnOrderIds: newBoard.columnOrderIds,
        });

        dispatch(boardSlice.actions.updateBoard(newBoard));
        toast.success("Bạn đã xóa danh sách này thành công");
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
  };

  const createNewColumn = async (newColumnData) => {
    await createColumn({
      ...newColumnData,
      board_id: board.id,
    }).then((data) => {
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
        const error = data.error;
        toast.error(error);
      }
    });
  };

  const updateColumn = async (columnId, updateData) => {
    try {
      const data = await updateColumnDetail(columnId, { ...updateData });
      if (data.status === 200) {
        const updatedColumn = data.data;
        const updatedColumns = board.columns.map((column, index) => {
          if (column.id === updatedColumn.id) {
            return updatedColumn;
          }
          return column;
        });
        const updatedBoard = { ...board, columns: updatedColumns };
        dispatch(boardSlice.actions.updateBoard(updatedBoard));
        toast.success("Cập nhật thành công");
      } else {
        const error = data.error;
        toast.error(error);
      }
    } catch (error) {
      console.error("Error updating column:", error);
    }
  };

  const createNewCard = async (newCardData, columnId) => {
    const data = await createCard({
      ...newCardData,
      workspace_id: workspace.id,
      column_id: columnId,
    });
    if (data.status === 200) {
      const createdCard = data.data;
      const updatedColumns = board.columns.map((column) => {
        if (column.id === columnId) {
          if (column.cards.some((card) => card.FE_PlaceholderCard)) {
            return {
              ...column,
              cards: [createdCard],
              cardOrderIds: [createdCard.id],
            };
          } else {
            return {
              ...column,
              cards: [...column.cards, createdCard],
              cardOrderIds: [...column.cardOrderIds, createdCard.id],
            };
          }
        }
        return column;
      });

      const updatedBoard = { ...board, columns: updatedColumns };
      dispatch(boardSlice.actions.updateBoard(updatedBoard));

      toast.success("Tạo thẻ thành công");
    } else {
      const error = data.error;
      toast.error(error);
    }
  };
  if (!board.id || +board.id !== +boardId) {
    return <Loading />;
  }
  // const updateBoard = async (boardId, updateData) => {
  //   const data = await updateBoardDetail(boardId, { ...updateData });
  //   if (data.status === 200) {
  //     const newBoard = { ...board };
  //     if (updateData.title) {
  //       newBoard.title = updateData.title;
  //       dispatch(boardSlice.actions.updateBoard(newBoard));
  //       toast.success("Cập nhật thành công");
  //     }
  //   } else {
  //     const error = data.error;
  //     toast.error(error);
  //   }
  // };
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
            deleteColumnDetail={deleteColumnDetail}
            createNewColumn={createNewColumn}
            createNewCard={createNewCard}
            updateColumn={updateColumn}
          />
        </div>
      </div>
    </div>
  );
}
// <ActivityBoard isActivity={isActivity} setIsActivity={setIsActivity} />
