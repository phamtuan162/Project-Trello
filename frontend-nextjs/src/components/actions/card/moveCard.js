"use client";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { arrayMove } from "@dnd-kit/sortable";
import { cloneDeep, isEmpty } from "lodash";
import { toast } from "react-toastify";

import { CloseIcon } from "@/components/Icon/CloseIcon";
import { getBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { cardSlice } from "@/stores/slices/cardSlice";
import {
  updateColumnDetail,
  moveCardToDifferentColumnAPI,
  moveCardToDifferentBoardAPI,
} from "@/services/workspaceApi";
import { generatePlaceholderCard } from "@/utils/formatters";
import { mapOrder } from "@/utils/sorts";
import { socket } from "@/socket";

const { deleteCardInBoard, updateColumnInBoard, updateBoard } =
  boardSlice.actions;
const { clearAndHideCard, updateCard } = cardSlice.actions;

const MoveCard = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const workspace = useSelector((state) => state.workspace.workspace);

  const [isOpen, setIsOpen] = useState(false);
  const [boardMove, setBoardMove] = useState(board);
  const [valueColumn, setValueColumn] = useState(card?.column_id);
  const [valueCardIndex, setValueCardIndex] = useState(card?.id);

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const cardsCurrent = useMemo(() => {
    const currentColumn = boardMove?.columns.find(
      (column) => +column.id === +valueColumn
    );

    return currentColumn?.cardOrderIds || [];
  }, [valueColumn, boardMove?.columns]);

  const onSelectBoard = async (boardIdSelect) => {
    if (!boardIdSelect || boardIdSelect === boardMove.id) return;

    if (+boardIdSelect === +board.id) {
      if (+boardIdSelect !== +boardMove.id) {
        HandleReset();
      }
      return;
    }

    try {
      await toast
        .promise(getBoardDetail(boardIdSelect, { isCard: true }), {
          pending: "Đang lấy column trong board này...",
        })
        .then((res) => {
          const { data: BoardNew } = res;

          if (!BoardNew?.columns?.length) {
            toast.error("Không thể di chuyển thẻ do bảng thiếu column.");
            HandleReset();
            return;
          }

          BoardNew.columns = mapOrder(
            BoardNew.columns,
            BoardNew.columnOrderIds,
            "id"
          );

          BoardNew.columns.forEach((column) => {
            if (isEmpty(column.cards)) {
              column.cards = [generatePlaceholderCard(column)];
              column.cardOrderIds = [generatePlaceholderCard(column).id];
            } else {
              column.cards = mapOrder(column.cards, column.cardOrderIds, "id");
            }
          });

          setBoardMove(BoardNew);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const moveCardWithinColumn = async (
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

    await toast
      .promise(
        async () =>
          await updateColumnDetail(valueColumn, {
            cardOrderIds: dndOrderedCardIds,
          }),
        { pending: "Đang di chuyển" }
      )
      .then((res) => {
        dispatch(updateColumnInBoard(updatedColumn));
        toast.success("Di chuyển thành công");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const moveCardToDifferentColumn = async (
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

    await toast
      .promise(
        async () =>
          await moveCardToDifferentColumnAPI({
            card_id: card.id,
            prevColumnId: nextActiveColumn.id,
            nextColumn: nextOverColumn,
          }),
        { pending: "Đang di chuyển..." }
      )
      .then((res) => {
        const { activity } = res;

        const cardMove = nextOverColumn.cards[newCardIndex];

        if (cardMove?.activities?.length) {
          cardMove.activities.unshift(activity);
        } else {
          cardMove.activities = [activity];
        }

        const cardUpdate = {
          id: card.id,
          column_id: nextOverColumn.id,
          activities: cardMove.activities,
        };

        dispatch(updateCard(cardUpdate));

        dispatch(updateBoard({ columns: nextColumns }));

        toast.success("Di chuyển thành công");

        socket.emit("updateCard", cardUpdate);
        socket.emit("updateBoard", { columns: nextColumns });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const moveCardWithinBoard = async () => {
    try {
      const newColumns = cloneDeep(board.columns);

      const columnIndex = newColumns.findIndex(
        (column) => column.id === +valueColumn
      );

      const oldCardIndex = cardsCurrent.findIndex((item) => item === +card.id);

      const newCardIndex = cardsCurrent.findIndex(
        (item) => item === +valueCardIndex
      );

      if (+valueColumn === +card.column_id) {
        await moveCardWithinColumn(
          newColumns,
          columnIndex,
          oldCardIndex,
          newCardIndex
        );
      } else {
        const nextOverColumn = newColumns.find(
          (column) => column.id === +valueColumn
        );
        const nextActiveColumn = newColumns.find(
          (column) => column.id === card.column_id
        );

        await moveCardToDifferentColumn(
          newColumns,
          nextActiveColumn,
          nextOverColumn,
          newCardIndex
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const moveCardToDifferentBoard = async () => {
    const newCardIndex = cardsCurrent.findIndex(
      (item) => item === +valueCardIndex
    );

    const activeColumns = cloneDeep(board.columns);
    const overColumns = cloneDeep(boardMove.columns);

    const nextOverColumn = overColumns.find((c) => c.id === +valueColumn);

    const nextActiveColumn = activeColumns.find((c) => c.id === card.column_id);

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

      nextOverColumn.cards = nextOverColumn.cards.filter(
        (c) => !c.FE_PlaceholderCard
      );

      nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card.id);
    }

    await toast
      .promise(
        async () =>
          await moveCardToDifferentBoardAPI({
            card_id: card.id,
            activeColumn: nextActiveColumn,
            overColumn: nextOverColumn,
          }),
        { pending: "Đang di chuyển..." }
      )
      .then((res) => {
        const cardDelete = { id: card.id, column_id: card.column_id };

        dispatch(deleteCardInBoard(cardDelete));
        dispatch(clearAndHideCard());

        toast.success("Di chuyển thành công");

        socket.emit("deleteCard", cardDelete);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (+boardMove.id === +board.id) {
        await moveCardWithinBoard();
      } else {
        await moveCardToDifferentBoard();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
    }
  };

  const HandleReset = async () => {
    setBoardMove(board);
    setValueColumn(card.column_id);
    setValueCardIndex(card.id);
  };

  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onClose={HandleReset}
      onOpenChange={(open) => {
        if (checkRole) {
          setIsOpen(open);
        } else {
          toast.error("Bạn không đủ quyền thực hiện thao tác này!");
        }
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 px-3">
        <form className="w-full" onSubmit={(e) => HandleSubmit(e)}>
          <div className="flex justify-between items-center relative">
            <h1 className="grow text-center ">Di chuyển thẻ</h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              onClick={() => {
                setIsOpen(false);
                HandleReset();
              }}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="w-full mt-3">
            <p className="text-xs font-medium">Chọn đích đến</p>
            <Select
              selectedKeys={[boardMove?.id?.toString()]}
              label="Bảng"
              className="mt-2 text-xs"
              classNames={{
                trigger: ["max-h-[40px] min-h-unit-10 "],
                value: ["text-xs font-medium "],
              }}
              onSelectionChange={(newValue) => {
                const boardIdSelect = [...newValue][0];
                onSelectBoard(boardIdSelect);
              }}
            >
              {workspace?.boards?.map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.title}
                </SelectItem>
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
              {boardMove?.columns?.map((column) => (
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
              {cardsCurrent?.length > 0 ? (
                cardsCurrent?.map((card, index) => (
                  <SelectItem key={card} textValue={index + 1}>
                    {index + 1}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key={9999} textValue={1}>
                  {1}
                </SelectItem>
              )}
            </Select>
          </div>
          <Button
            type="submit"
            color="primary"
            className="mt-2 interceptor-loading"
            isDisabled={!checkRole}
          >
            Di chuyển
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
export default MoveCard;
