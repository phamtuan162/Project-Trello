"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ListContainer } from "./_components/ListContainer";
import {
  getBoardDetail,
  updateBoardDetail,
  updateColumnDetail,
  moveCardToDifferentColumnAPI,
  deleteColumn,
  createColumn,
  createCard,
} from "@/apis";
import BoardNavbar from "./_components/BoardNavbar";
import { generatePlaceholderCard } from "@/utils/formatters";
import { mapOrder } from "@/utils/sorts";
import { isEmpty } from "lodash";

import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";
export default function BoardIdPage() {
  const { id: boardId } = useParams();
  const [board, setBoard] = useState(null);
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await getBoardDetail(boardId);
        if (response && response.data) {
          let boardData = response.data;
          boardData.columns = mapOrder(
            boardData.columns,
            boardData.columnOrderIds,
            "id"
          );

          boardData.columns.forEach((column) => {
            if (isEmpty(column.cards)) {
              column.cards = [generatePlaceholderCard(column)];
              column.cardOrderIds = [generatePlaceholderCard(column).id];
            } else {
              column.cards = mapOrder(column.cards, column.cardOrderIds, "id");
            }
          });
          setBoard(boardData);
        }
      } catch (error) {
        console.error("Error fetching board detail:", error);
      }
    };

    fetchBoardDetail();
  }, []);

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c.id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);
    updateBoardDetail(newBoard.id, {
      columnOrderIds: dndOrderedColumnsIds,
    });
  };

  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column.id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }

    updateColumnDetail(columnId, { cardOrderIds: dndOrderedCardIds });

    setBoard(newBoard);
  };

  const moveCardToDifferentColumn = async (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c.id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;

    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);
    // newBoard.columns.forEach((column) => {
    //   if (
    //     column.id === prevColumnId &&
    //     typeof column.cardOrderIds[0] === "string" &&
    //     column.cardOrderIds[0].indexOf("placeholder-card") !== -1
    //   ) {
    //     column.cardOrderIds = [];
    //     column.cards = [];
    //   }
    // });
    const updatedColumns = newBoard.columns.map((column) => {
      if (
        column.id === prevColumnId &&
        typeof column.cardOrderIds[0] === "string" &&
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
    moveCardToDifferentColumnAPI(newBoard.id, updatedBoard);
  };

  const deleteColumnDetail = async (columnId) => {
    try {
      const newBoard = { ...board };
      newBoard.columns = newBoard.columns.filter((c) => c.id !== columnId);
      newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
        (id) => id !== columnId
      );

      await deleteColumn(columnId);

      await updateBoardDetail(newBoard.id, {
        columnOrderIds: newBoard.columnOrderIds,
      });

      setBoard(newBoard);
      toast.success("Bạn đã xóa danh sách thành công");
    } catch (error) {
      console.error("Lỗi khi xóa danh sách:", error);
    }
  };

  const createNewColumn = async (newColumnData) => {
    try {
      const response = await createColumn({
        ...newColumnData,
        board_id: board.id,
      });
      const createdColumn = response.data;
      const placeholderCard = generatePlaceholderCard(createdColumn);
      createdColumn.cards = [placeholderCard];
      createdColumn.cardOrderIds = [placeholderCard.id];
      const newBoard = { ...board };
      if (newBoard.columnOrderIds === null) {
        newBoard.columnOrderIds = [];
      }
      newBoard.columns.push(createdColumn);
      newBoard.columnOrderIds.push(createdColumn.id);
      setBoard(newBoard);

      toast.success("Tạo danh sách thành công");
    } catch (error) {
      console.error("Lỗi khi tạo danh sách mới:", error);
    }
  };

  const updateColumn = async (columnId, updateData) => {
    try {
      const response = await updateColumnDetail(columnId, { ...updateData });
      const updatedColumn = response.data;
      const newBoard = { ...board };
      const columnIndex = newBoard.columns.findIndex(
        (column) => column.id === updatedColumn.id
      );
      if (columnIndex !== -1) {
        newBoard.columns[columnIndex] = updatedColumn;
        setBoard(newBoard);
        toast.success("Cập nhật thành công");
      } else {
        console.error("Không tìm thấy thẻ cần cập nhật trong newBoard");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thẻ:", error);
    }
  };

  const createNewCard = async (newCardData, columnId) => {
    try {
      const data = await createCard({
        ...newCardData,
        column_id: columnId,
      });
      const createdCard = data.data;
      const newBoard = { ...board };
      const columnToUpdate = newBoard.columns.find(
        (column) => column.id === createdCard.column_id
      );
      if (columnToUpdate) {
        if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
          columnToUpdate.cards = [createdCard];
          columnToUpdate.cardOrderIds = [createdCard.id];
        } else {
          columnToUpdate.cards.push(createdCard);
          columnToUpdate.cardOrderIds.push(createdCard.id);
        }
      }
      setBoard(newBoard);
      toast.success("Tạo thẻ thành công");
    } catch (error) {
      console.error("Lỗi khi tạo thẻ mới :", error);
    }
  };

  const updateBoard = async (boardId, updateData) => {
    try {
      await updateBoardDetail(boardId, { ...updateData });
      const newBoard = { ...board };
      if (updateData.title) {
        newBoard.title = updateData.title;
        setBoard(newBoard);
        toast.success("Cập nhật thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bảng:", error);
    }
  };
  return (
    <>
      {board ? (
        <div
          className="relative h-full bg-no-repeat bg-cover bg-center "
          style={{
            backgroundImage: board?.background
              ? `url(${board.background})`
              : "",
          }}
        >
          <BoardNavbar board={board} updateBoard={updateBoard} />
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative pt-28 h-full">
            <div className="p-4 h-full overflow-y-hidden overflow-x-auto">
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
                updateBoard={updateBoard}
              />
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
