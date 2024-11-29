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
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { cloneDeep, isEmpty } from "lodash";
import { mapOrder } from "@/utils/sorts";
import { toast } from "react-toastify";

import { getBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { generatePlaceholderCard } from "@/utils/formatters";
import { copyCardWithBoardApi } from "@/services/workspaceApi";

const { updateColumnInBoard } = boardSlice.actions;

function generateRandomId() {
  return Math.floor(Math.random() * 10000);
}

const CopyCard = ({ children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const [title, setTitle] = useState(card?.title);
  const [boardMove, setBoardMove] = useState(board);
  const [valueColumn, setValueColumn] = useState(card?.column_id);
  const [valueCardIndex, setValueCardIndex] = useState(card?.id);
  const [selected, setSelected] = useState([]);

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
    if (+boardIdSelect === +board.id) {
      if (+boardIdSelect !== +boardMove.id) {
        HandleReset();
      }

      return;
    }

    try {
      await toast
        .promise(getBoardDetail(boardIdSelect, { isCard: false }), {
          pending: "Đang lấy column trong board này...",
        })
        .then((res) => {
          const { data: BoardNew } = res;

          if (BoardNew.columns.length === 0) {
            toast.error("Không thể sao chép thẻ do bảng thiếu column.");
            HandleReset();
            return;
          }

          BoardNew.columns = mapOrder(
            BoardNew.columns,
            BoardNew.columnOrderIds,
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

          setBoardMove(BoardNew);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    if (!valueColumn || !valueCardIndex || !title) {
      setIsOpen(false);
      return;
    }

    try {
      const nextColumns = cloneDeep(boardMove.columns);

      const nextOverColumn = nextColumns.find(
        (column) => column.id === +valueColumn
      );

      const overCardIndex = cardsCurrent.findIndex(
        (item) => item === +valueCardIndex
      );

      const cardCopy = {
        ...card,
        title: title,
        id: generateRandomId(),
        column_id: nextOverColumn.id,
      };

      nextOverColumn.cards = nextOverColumn.cards.toSpliced(
        overCardIndex,
        0,
        cardCopy
      );

      nextOverColumn.cards = nextOverColumn.cards.filter(
        (c) => !c.FE_PlaceholderCard
      );

      nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card.id);

      const checkBoard = +board.id === +boardMove.id;

      await toast
        .promise(
          async () =>
            await copyCardWithBoardApi({
              keptItems: selected,
              matchBoard: checkBoard,
              card: cardCopy,
              overColumn: nextOverColumn,
            }),
          { pending: "Đang sao chép..." }
        )
        .then((res) => {
          const { data } = res;

          if (checkBoard) {
            const cardUpdates = nextOverColumn.cards.map((c) =>
              c.id === cardCopy.id ? data : c
            );

            dispatch(
              updateColumnInBoard({
                id: nextOverColumn.id,
                cards: cardUpdates,
                cardOrderIds: cardUpdates.map((c) => c.id),
              })
            );
          }

          toast.success("Sao chép thẻ thành công");
        })
        .catch((error) => {
          console.log(error);
        });
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
    setTitle(card.title);
    setSelected([]);
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
            <h1 className="grow text-center ">Sao chép</h1>
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

          <div className="flex flex-col gap-1 mt-2 w-full">
            <CheckboxGroup
              value={selected}
              onValueChange={setSelected}
              label={
                (card?.works?.length > 0 ||
                  card?.attachments?.length > 0 ||
                  card?.comments?.length > 0 ||
                  card?.users?.length > 0) && (
                  <p
                    className="text-xs font-medium"
                    style={{ color: "#172b4d" }}
                  >
                    Giữ...
                  </p>
                )
              }
            >
              {card?.works?.length > 0 && (
                <Checkbox value="works">
                  Danh sách công việc ({card?.works?.length})
                </Checkbox>
              )}
              {card?.users?.length > 0 && (
                <Checkbox value="users">
                  Thành viên ({card?.users?.length})
                </Checkbox>
              )}
              {card?.attachments?.length > 0 && (
                <Checkbox value="attachments">
                  Tập tin đính kèm ({card.attachments.length})
                </Checkbox>
              )}
              {card?.comments?.length > 0 && (
                <Checkbox value="comments">
                  Bình luận ({card.comments.length})
                </Checkbox>
              )}
            </CheckboxGroup>
          </div>

          <div className="w-full mt-3">
            <p className="text-xs font-medium">Sao chép tới...</p>
            <Select
              selectedKeys={[boardMove?.id?.toString()]}
              label="Bảng"
              className="mt-1 text-xs"
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
            Tạo thẻ
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
export default CopyCard;
