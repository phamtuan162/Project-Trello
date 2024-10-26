"use client";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import {
  updateBoardDetail,
  updateColumnDetail,
  moveCardToDifferentColumnAPI,
  createColumn,
} from "@/services/workspaceApi";
import { mapOrder } from "@/utils/sorts";
import { generatePlaceholderCard } from "@/utils/formatters";
import { ListContainer } from "./_components/ListContainer";
import Loading from "@/components/Loading/Loading";
import { boardSlice } from "@/stores/slices/boardSlice";
import { cardSlice } from "@/stores/slices/cardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";

const { updateCard } = cardSlice.actions;
const { updateBoard } = boardSlice.actions;
export default function BoardIdPage() {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const { id: boardId } = useParams();

  useEffect(() => {
    if (!board?.id || !card?.id) return;

    let isSearchSuccess = false;
    const updatedColumns = board.columns.map((column) => {
      if (!isSearchSuccess) {
        const cardFound = column.cards.some((c) => +c.id === +card.id);
        if (cardFound) {
          isSearchSuccess = true; //
          return {
            ...column,
            cards: column.cards.map((c) => (c.id === card.id ? card : c)),
          };
        }
      }
      return column;
    });

    dispatch(updateBoard({ ...board, columns: updatedColumns }));
  }, [card]);

  const moveColumns = async (dndOrderedColumns) => {
    const newBoard = {
      ...board,
      columns: [...dndOrderedColumns],
      columnOrderIds: dndOrderedColumns.map((c) => c.id),
    };
    dispatch(boardSlice.actions.updateBoard(newBoard));

    const { error } = await updateBoardDetail(newBoard.id, {
      columnOrderIds: newBoard.columnOrderIds,
    });

    if (error) {
      console.log(error);
    }
  };

  const moveCardInTheSameColumn = async (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
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

    const newBoard = { ...board, columns: updatedColumns };
    dispatch(boardSlice.actions.updateBoard(newBoard));

    const { error } = await updateColumnDetail(columnId, {
      cardOrderIds: dndOrderedCardIds,
    });

    if (error) {
      console.log(error);
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

    const updatedColumns = newBoard.columns.map((column) => {
      const isPlaceholderExist =
        column.cardOrderIds.includes("placeholder-card");
      if (isPlaceholderExist) {
        return { ...column, cardOrderIds: [], cards: [] };
      }
      return column;
    });

    const updatedBoard = { ...newBoard, columns: updatedColumns };

    try {
      const { data, status, error } = await moveCardToDifferentColumnAPI({
        updateBoard: updatedBoard,
        card_id: currentCardId,
        prevColumnId: prevColumnId,
        nextColumnId: nextColumnId,
      });
      if (200 <= status && status <= 299) {
        const updatedCard = {
          ...card,
          activities:
            card.activities.length > 0 ? [data, ...card.activities] : [data],
        };
        dispatch(updateCard(updatedCard));
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error("Error moving card to different column:", error);
    }
  };

  const createNewColumn = async (newColumnData) => {
    try {
      const { data, status, error } = await createColumn({
        ...newColumnData,
        board_id: board.id,
      });
      if (200 <= status && status <= 299) {
        const createdColumn = data;
        const placeholderCard = generatePlaceholderCard(createdColumn);
        createdColumn.cards = [placeholderCard];
        createdColumn.cardOrderIds = [placeholderCard.id];

        // const newColumns = [...board.columns, createdColumn];
        // const newBoard = {
        //   ...board,
        //   columns: newColumns,
        //   columnOrderIds: [...board.columnOrderIds, createdColumn.id],
        // };

        const newBoard = { ...board };
        newBoard.columns = newBoard.columns.concat(createdColumn);
        newBoard.columnOrderIds = newBoard.columnOrderIds.concat(
          createdColumn.id
        );

        dispatch(boardSlice.actions.updateBoard(newBoard));
        toast.success("Tạo danh sách thành công");
      } else {
        toast.error(error);
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
            updateColumn={updateColumn}
          />
        </div>
      </div>
    </div>
  );
}
