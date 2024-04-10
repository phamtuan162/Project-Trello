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
  Input,
} from "@nextui-org/react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { getBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { cardSlice } from "@/stores/slices/cardSlice";
import { arrayMove } from "@dnd-kit/sortable";
import {
  updateColumnDetail,
  moveCardToDifferentColumnAPI,
  moveCardToDifferentBoardAPI,
} from "@/services/workspaceApi";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholderCard } from "@/utils/formatters";
import useCardModal from "@/hooks/use-card-modal";

const { updateBoard } = boardSlice.actions;
const { updateCard } = cardSlice.actions;
const CopyCard = ({ children }) => {
  const dispatch = useDispatch();
  const cardModal = useCardModal();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const [title, setTitle] = useState(card.title);
  const [boardMove, setBoardMove] = useState(board);
  const [valueBoard, setValueBoard] = useState(board.id);
  const [valueColumn, setValueColumn] = useState(card.column_id);
  const [valueCardIndex, setValueCardIndex] = useState(card.id);
  const [columnsCurrent, setColumnsCurrent] = useState(board.columns);
  const workspaces = useMemo(() => {
    return user?.workspaces?.filter((workspace) => workspace.boards.length > 0);
  }, [user]);
  const cardsCurrent = useMemo(() => {
    if (+valueColumn === card.column_id) {
      setValueCardIndex(card.id);
    }
    const currentColumn = columnsCurrent.find(
      (column) => +column.id === +valueColumn
    );

    return currentColumn?.cardOrderIds?.length > 0
      ? currentColumn.cardOrderIds
      : [`${card.column_id}-placeholder-card`];
  }, [valueColumn, card, columnsCurrent]);
  useEffect(() => {
    const fetchData = async () => {
      if (valueBoard) {
        const data = await getBoardDetail(+valueBoard);
        const columns = data.data.columns || [];
        setBoardMove(data.data);
        setColumnsCurrent(columns);
        setValueColumn(card.column_id);
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

    const response = await updateColumnDetail(valueColumn, {
      cardOrderIds: dndOrderedCardIds,
    });
    if (response.status === 200) {
      dispatch(updateBoard(newBoard));
      setColumnsCurrent(newBoard.columns);
    } else {
      const error = response.error;
      toast.error(error);
    }
  };

  const moveCardToDifferentColumn = async (
    newBoard,
    nextColumns,
    nextActiveColumn,
    nextOverColumn,
    newCardIndex
  ) => {
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
      nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card.id);
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
    const response = await moveCardToDifferentColumnAPI(
      newBoard.id,
      updatedBoard
    );
    if (response.status === 200) {
      dispatch(
        updateCard({
          ...card,
          column_id: nextOverColumn.id,
          column: { ...nextOverColumn },
        })
      );
    } else {
      const error = response.error;
      toast.error(error);
    }
  };

  const moveCardWithinBoard = async () => {
    const newBoard = { ...boardMove };
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
      const nextColumns = cloneDeep(columnsCurrent);
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
  };

  const moveCardToDifferentBoard = async () => {
    const boardActive = { ...board };
    const newCardIndex = cardsCurrent.findIndex(
      (item) => item === +valueCardIndex
    );
    const activeColumns = cloneDeep(board.columns);
    const overColumns = cloneDeep(columnsCurrent);

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
      nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card.id);
    }

    const dndOrderedColumnsIdsActive = activeColumns.map((c) => c.id);
    boardActive.columns = [...activeColumns];
    boardActive.columnOrderIds = dndOrderedColumnsIdsActive;
    dispatch(updateBoard(boardActive));

    moveCardToDifferentBoardAPI({
      card_id: card.id,
      activeColumn: nextActiveColumn,
      overColumn: nextOverColumn,
    }).then((data) => {
      if (data.status === 200) {
        cardModal.onClose();
      } else {
        const error = response.error;
        toast.error(error);
      }
    });
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
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
    setColumnsCurrent(board.columns);
  };

  const HandleChange = (e) => {
    setTitle(e.target.value);
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
            <h1 className="grow text-center ">Sao chép</h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              onClick={() => HandleReset()}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="mb-2">
            <p className="text-xs font-medium">Tiêu đề</p>
            <div className="mt-1 flex flex-col gap-2 w-full">
              <Input
                onChange={HandleChange}
                value={title}
                name="title"
                id="title"
                size="xs"
                variant="bordered"
                aria-label="input-label"
                isRequired
              />
            </div>
          </div>
          <div className="w-full mt-3">
            <p className="text-xs font-medium">Sao chép tới...</p>
            <Select
              selectedKeys={[valueBoard.toString()]}
              label="Bảng"
              className="mt-1 text-xs"
              classNames={{
                trigger: ["max-h-[40px] min-h-unit-10 "],
                value: ["text-xs font-medium "],
              }}
              onSelectionChange={(newValue) => {
                setValueBoard([...newValue][0]);
              }}
            >
              {workspaces.map((workspace) => (
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
                setValueColumn([...newValue][0]);
              }}
            >
              {columnsCurrent.map((column) => (
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
            className="mt-2"
            isDisabled={user?.role?.toLowerCase() !== "admin"}
          >
            Tạo thẻ
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
export default CopyCard;
