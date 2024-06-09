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
  CircularProgress,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { getBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
import { generatePlaceholderCard } from "@/utils/formatters";
import { copyCardWithBoardApi } from "@/services/workspaceApi";
import { cloneDeep, isEmpty } from "lodash";
import { mapOrder } from "@/utils/sorts";
import { toast } from "react-toastify";
const { updateBoard } = boardSlice.actions;
const { updateColumn } = columnSlice.actions;

function generateRandomId() {
  return Math.floor(Math.random() * 10000);
}

const CopyCard = ({ children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const columns = useSelector((state) => state.column.columns);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [boardMove, setBoardMove] = useState(board);
  const [valueBoard, setValueBoard] = useState(board.id);
  const [valueColumn, setValueColumn] = useState(card.column_id);
  const [valueCardIndex, setValueCardIndex] = useState(card.id);
  const [selected, setSelected] = useState([]);
  const workspaces = useMemo(() => {
    return user?.workspaces?.filter((workspace) => workspace.boards.length > 0);
  }, [user]);

  const cardsCurrent = useMemo(() => {
    const currentColumn = columns.find((column) => +column.id === +valueColumn);
    return currentColumn?.cardOrderIds;
  }, [valueColumn, columns]);

  useEffect(() => {
    const fetchData = async () => {
      if (valueBoard) {
        const data = await getBoardDetail(+valueBoard);
        if (data.status === 200) {
          let boardData = data.data;

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
      }
    };

    fetchData();
  }, [valueBoard]);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (valueBoard && valueColumn && valueCardIndex && title) {
        const newBoard = { ...boardMove };
        const nextColumns = cloneDeep(columns);
        const nextOverColumn = nextColumns.find(
          (column) => column.id === +valueColumn
        );
        const overCardIndex = cardsCurrent.findIndex(
          (item) => item === +valueCardIndex
        );
        const shouldCopyUsers = selected?.includes("users");

        if (nextOverColumn) {
          const cardCopy = {
            ...card,
            title: title,
            users: shouldCopyUsers ? card.users : [],
            id: generateRandomId(),
            column_id: nextOverColumn.id,
          };

          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            overCardIndex,
            0,
            cardCopy
          );
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card.id
          );

          newBoard.columns = [...nextColumns];
          const checkBoard = +board.id === +valueBoard;

          const nextOverColumnCopy = {
            ...nextOverColumn,
            cards: nextOverColumn.cards.filter(
              (card) => !card.FE_PlaceholderCard
            ),
            cardOrderIds: nextOverColumn.cards.map((card) => card.id),
          };

          const data = await copyCardWithBoardApi({
            keptItems: selected,
            user_id: user.id,
            matchBoard: checkBoard,
            card: cardCopy,
            overColumn: nextOverColumnCopy,
          });

          if (data.status === 200) {
            setTitle(card.title);
            if (checkBoard) {
              dispatch(updateBoard(newBoard));
              dispatch(updateColumn(newBoard.columns));
              toast.success("Sao chép thẻ thành công");
              setIsOpen(false);
              setValueCardIndex(card.id);
            }
            setSelected([]);
          } else {
            const error = data.error;
            toast.error(error);
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while copying the card.");
    } finally {
      setIsLoading(false);
    }
  };

  const HandleReset = async () => {
    setIsOpen(false);
    setValueBoard(board.id);
    setValueColumn(card.column_id);
    setValueCardIndex(card.id);
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
                  Danh sách công việc ({card.works.length})
                </Checkbox>
              )}
              {card?.users?.length > 0 && (
                <Checkbox value="users">
                  Thành viên ({card.users.length})
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
              selectedKeys={[valueBoard?.toString()]}
              label="Bảng"
              className="mt-1 text-xs"
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
                if (+[...newValue][0] === +card.column_id) {
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
            className="mt-2"
            isDisabled={
              (user?.role?.toLowerCase() !== "admin" &&
                user?.role?.toLowerCase() !== "owner") ||
              isLoading
            }
          >
            {isLoading ? <CircularProgress /> : "Tạo thẻ"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
export default CopyCard;
