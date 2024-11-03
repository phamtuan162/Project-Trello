"use client";
import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Select,
  SelectItem,
  SelectSection,
  CircularProgress,
} from "@nextui-org/react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { getBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { cardSlice } from "@/stores/slices/cardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
import { arrayMove } from "@dnd-kit/sortable";
import {
  updateColumnDetail,
  moveCardToDifferentColumnAPI,
  moveCardToDifferentBoardAPI,
} from "@/services/workspaceApi";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholderCard } from "@/utils/formatters";
import useCardModal from "@/hooks/use-card-modal";
import { mapOrder } from "@/utils/sorts";
import { toast } from "react-toastify";
const { updateBoard } = boardSlice.actions;
const { updateCard } = cardSlice.actions;
const { updateColumn } = columnSlice.actions;
const MoveCard = ({ children }) => {
  const dispatch = useDispatch();
  const cardModal = useCardModal();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const columns = useSelector((state) => state.column.columns);
  const [isLoading, setIsLoading] = useState(false);
  const [boardMove, setBoardMove] = useState(board);
  const [valueBoard, setValueBoard] = useState(board.id);
  const [valueColumn, setValueColumn] = useState(card.column_id);
  const [valueCardIndex, setValueCardIndex] = useState(card.id);
  const workspaces = useMemo(() => {
    return user?.workspaces?.filter((workspace) => workspace.boards.length > 0);
  }, [user]);

  const cardsCurrent = useMemo(() => {
    const currentColumn = columns.find((column) => +column.id === +valueColumn);
    return currentColumn?.cardOrderIds;
  }, [valueColumn, columns]);

  useEffect(() => {
    if (!valueBoard) return;

    const fetchData = async () => {
      try {
        const { data, status } = await getBoardDetail(+valueBoard);
        if (200 <= status && status <= 299) {
          let boardData = data;

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
          dispatch(updateColumn(boardData.columns));
          setBoardMove(boardData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [valueBoard]);

  const moveCardWithinColumn = async (
    newBoard,
    newColumns,
    columnIndex,
    oldCardIndex,
    newCardIndex
  ) => {
    try {
      const updatedColumn = { ...newColumns[columnIndex] };
      const dndOrderedCards = arrayMove(
        updatedColumn.cards,
        oldCardIndex,
        newCardIndex
      );
      const dndOrderedCardIds = dndOrderedCards.map((card) => card.id);
      updatedColumn.cards = dndOrderedCards;
      updatedColumn.cardOrderIds = dndOrderedCardIds;
      newColumns[columnIndex] = updatedColumn;
      newBoard.columns = newColumns;

      const { status } = await updateColumnDetail(valueColumn, {
        cardOrderIds: dndOrderedCardIds,
      });
      if (200 <= status && status <= 299) {
        dispatch(updateBoard(newBoard));
        dispatch(updateColumn(newColumns));
        setValueCardIndex(card.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const moveCardToDifferentColumn = async (
    newBoard,
    nextColumns,
    nextActiveColumn,
    nextOverColumn,
    newCardIndex
  ) => {
    try {
      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (item) => item.id !== card.id
        );
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (item) => item.id
        );
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (item) => item.id !== card.id
        );
        const rebuild_activeDraggingCardData = {
          ...card,
          column_id: nextOverColumn.id,
        };
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card.id
        );
      }

      const dndOrderedColumnsIds = nextColumns.map((c) => c.id);
      newBoard.columns = [...nextColumns];
      newBoard.columnOrderIds = dndOrderedColumnsIds;
      dispatch(updateBoard(newBoard));

      const updatedColumns = newBoard.columns.map((column) => {
        if (
          typeof column.cardOrderIds[0] === "string" &&
          column.cardOrderIds[0].indexOf("placeholder-card") !== -1
        ) {
          return { ...column, cardOrderIds: [], cards: [] };
        }
        return column;
      });

      const updatedBoard = { ...newBoard, columns: updatedColumns };

      const { status } = await moveCardToDifferentColumnAPI({
        updateBoard: updatedBoard,
        card_id: card.id,
        prevColumnId: nextActiveColumn.id,
        nextColumnId: nextOverColumn.id,
      });
      if (200 <= status && status <= 299) {
        dispatch(
          updateCard({
            ...card,
            column_id: nextOverColumn.id,
            column: nextOverColumn,
            activities: [data.data, ...card.activities],
          })
        );
        dispatch(updateColumn(updatedColumns));
        setValueCardIndex(card.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const moveCardWithinBoard = async () => {
    try {
      const newBoard = { ...board };
      const newColumns = [...newBoard.columns];
      const columnIndex = newColumns.findIndex(
        (column) => column.id === +valueColumn
      );
      const oldCardIndex = cardsCurrent.findIndex((item) => item === +card.id);
      const newCardIndex = cardsCurrent.findIndex(
        (item) => item === +valueCardIndex
      );

      if (+valueColumn === +card.column_id) {
        await moveCardWithinColumn(
          newBoard,
          newColumns,
          columnIndex,
          oldCardIndex,
          newCardIndex
        );
      } else {
        const nextColumns = cloneDeep(columns);
        const nextOverColumn = nextColumns.find(
          (column) => column.id === +valueColumn
        );
        const nextActiveColumn = nextColumns.find(
          (column) => column.id === card.column_id
        );
        await moveCardToDifferentColumn(
          newBoard,
          nextColumns,
          nextActiveColumn,
          nextOverColumn,
          newCardIndex
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const moveCardToDifferentBoard = async () => {
    try {
      const boardActive = { ...board };
      const newCardIndex = cardsCurrent.findIndex(
        (item) => item === +valueCardIndex
      );
      const activeColumns = cloneDeep(board.columns);
      const overColumns = cloneDeep(columns);

      const nextOverColumn = overColumns.find(
        (column) => column.id === +valueColumn
      );
      const nextActiveColumn = activeColumns.find(
        (column) => column.id === card.column_id
      );

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (item) => item.id !== card.id
        );

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (item) => item.id
        );
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (item) => item.id !== card.id
        );
        const rebuild_activeDraggingCardData = {
          ...card,
          column_id: nextOverColumn.id,
        };
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card.id
        );
      }

      const dndOrderedColumnsIdsActive = activeColumns.map((c) => c.id);
      boardActive.columns = [...activeColumns];
      boardActive.columnOrderIds = dndOrderedColumnsIdsActive;
      dispatch(updateBoard(boardActive));

      const nextActiveColumnCopy = { ...nextActiveColumn };
      nextActiveColumnCopy.cards = nextActiveColumnCopy.cards.filter(
        (item) => !item.FE_PlaceholderCard
      );
      nextActiveColumnCopy.cardOrderIds = nextActiveColumnCopy.cards.map(
        (card) => card.id
      );

      const { status } = await moveCardToDifferentBoardAPI({
        user_id: user.id,
        card_id: card.id,
        activeColumn: nextActiveColumnCopy,
        overColumn: nextOverColumn,
      });
      if (200 <= status && status <= 299) {
        dispatch(updateColumn(boardActive.columns));
        setValueCardIndex(card.id);
        cardModal.onClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (+valueBoard === +board.id) {
      await moveCardWithinBoard();
    } else {
      await moveCardToDifferentBoard();
    }
  };

  const HandleReset = async () => {
    setIsOpen(false);
    setValueBoard(board.id);
    setValueColumn(card.column_id);
  };
  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onClose={HandleReset}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 px-3">
        <form className="w-full" onSubmit={(e) => HandleSubmit(e)}>
          <div className="flex justify-between items-center relative">
            <h1 className="grow text-center ">Di chuyển thẻ</h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              onClick={() => HandleReset()}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="w-full mt-3">
            <p className="text-xs font-medium">Chọn đích đến</p>
            <Select
              selectedKeys={[valueBoard?.toString()]}
              label="Bảng"
              className="mt-2 text-xs"
              classNames={{
                trigger: ["max-h-[40px] min-h-unit-10 "],
                value: ["text-xs font-medium "],
              }}
              onSelectionChange={(newValue) => {
                if (+[...newValue][0] === +board.id) {
                  setValueColumn(card.column_id);
                }
                setValueBoard([...newValue][0] || valueBoard);
              }}
            >
              {workspaces?.map((workspace) => (
                <SelectSection key={workspace.id} title={workspace.name}>
                  {workspace.boards.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.title}
                    </SelectItem>
                  ))}
                </SelectSection>
              ))}
            </Select>
          </div>
          <div className="flex gap-2 mt-2">
            <Select
              selectedKeys={[valueColumn?.toString()]}
              label="Danh sách"
              className="text-xs"
              classNames={{
                trigger: ["max-h-[40px] min-h-unit-10 w-[180px]"],
                value: ["text-xs font-medium "],
              }}
              onSelectionChange={(newValue) => {
                if (+[...newValue][0] === card.column_id) {
                  setValueCardIndex(card.id);
                }
                setValueColumn([...newValue][0]);
              }}
            >
              {columns.map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.title}
                </SelectItem>
              ))}
            </Select>
            <Select
              selectedKeys={[valueCardIndex?.toString()]}
              label="Vị trí"
              className="text-xs"
              classNames={{
                trigger: ["max-h-[40px]  min-h-unit-10 "],
                value: ["text-xs font-medium "],
              }}
              onSelectionChange={(newValue) => {
                setValueCardIndex([...newValue][0]);
              }}
            >
              {cardsCurrent?.map((card, index) => (
                <SelectItem key={card} textValue={index + 1}>
                  {index + 1}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Button
            type="submit"
            color="primary"
            className="mt-2 interceptor-loading"
            isDisabled={
              (user?.role?.toLowerCase() !== "admin" &&
                user?.role?.toLowerCase() !== "owner") ||
              isLoading
            }
          >
            {isLoading ? <CircularProgress size={16} /> : " Di chuyển"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
export default MoveCard;
