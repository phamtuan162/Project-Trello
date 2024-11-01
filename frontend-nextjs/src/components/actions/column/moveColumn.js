"use client";
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
import { updateBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
import { cloneDeep, isEmpty } from "lodash";
import { arrayMove } from "@dnd-kit/sortable";
import { mapOrder } from "@/utils/sorts";
import { toast } from "react-toastify";
import { moveColumnToDifferentBoardAPI } from "@/services/workspaceApi";
import { generatePlaceholderCard } from "@/utils/formatters";
const { updateBoard } = boardSlice.actions;
const { updateColumn } = columnSlice.actions;
const MoveColumn = ({ children, column }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const [isLoading, setIsLoading] = useState(false);
  const [boardMove, setBoardMove] = useState(board);
  const columns = useSelector((state) => state.column.columns);
  const [valueBoard, setValueBoard] = useState(board.id);
  const [valueColumn, setValueColumn] = useState(column.id);

  const workspaces = useMemo(
    () => user?.workspaces?.filter((w) => w.boards.length > 0),
    [user]
  );

  useEffect(() => {
    if (!valueBoard) {
      setBoardMove(board);
      return;
    }

    const fetchBoardDetails = async () => {
      try {
        const { data, status, error, message } = await getBoardDetail(
          valueBoard
        );
        if (200 <= status && status <= 299) {
          const boardData = data;

          boardData.columns = mapOrder(
            boardData.columns,
            boardData.columnOrderIds,
            "id"
          );

          boardData.columns.forEach((col) => {
            if (isEmpty(col.cards)) {
              const placeholderCard = generatePlaceholderCard(col);
              col.cards = [placeholderCard];
              col.cardOrderIds = [placeholderCard.id];
            } else {
              col.cards = mapOrder(col.cards, col.cardOrderIds, "id");
            }
          });

          dispatch(updateColumn(boardData.columns));
          setBoardMove(boardData);
        }
      } catch (error) {
        console.log(error || message);
      }
    };
    fetchBoardDetails();
  }, [valueBoard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (+valueBoard !== +column.board_id) {
        const boardActive = cloneDeep(board);
        const boardOver = cloneDeep(boardMove);
        const newColumnIndex = columns.findIndex((c) => c.id === +valueColumn);

        boardActive.columns = boardActive.columns.filter(
          (c) => c.id !== column.id
        );
        boardActive.columnOrderIds = boardActive.columns.map((c) => c.id);

        const updatedColumn = { ...column, board_id: boardOver.id };
        boardOver.columns = boardOver.columns.toSpliced(
          newColumnIndex,
          0,
          updatedColumn
        );
        boardOver.columnOrderIds = boardOver.columns.map((c) => c.id);

        const { data, status, error, message } =
          await moveColumnToDifferentBoardAPI(column.id, {
            user_id: user.id,
            boardActive,
            boardOver,
          });

        if (200 <= status && status <= 299) {
          dispatch(updateBoard(boardActive));
          dispatch(updateColumn(boardActive.columns));
          setIsOpen(false);
        } else {
          toast.error(error || message);
        }

        return;
      }

      if (+column.id !== +valueColumn) {
        const newColumns = arrayMove(
          columns,
          columns.findIndex((c) => +c.id === +column.id),
          columns.findIndex((c) => +c.id === +valueColumn)
        );

        const newBoard = {
          ...board,
          columns: newColumns,
          columnOrderIds: newColumns.map((c) => c.id),
        };

        const { data, status, error, message } = await updateBoardDetail(
          newBoard.id,
          {
            columnOrderIds: newBoard.columnOrderIds,
          }
        );

        if (200 <= status && status <= 299) {
          dispatch(updateBoard(newBoard));
          dispatch(updateColumn(newColumns));
          setIsOpen(false);
        } else {
          toast.error(error || message);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const HandleReset = async () => {
    setIsOpen(false);
    setValueBoard(board.id);
    setValueColumn(column.id);
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
      <PopoverContent className="w-[260px] p-2 px-3">
        <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex justify-between items-center relative">
            <h1 className="grow text-center font-medium text-xs">
              Di chuyển danh sách
            </h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="w-full mt-3">
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
          <div className="w-full mt-2">
            <Select
              selectedKeys={[valueColumn?.toString()]}
              label="Vị trí"
              className="text-xs"
              classNames={{
                trigger: ["max-h-[40px] min-h-unit-10 w-full"],
                value: ["text-xs font-medium "],
              }}
              onSelectionChange={(newValue) => {
                setValueColumn([...newValue][0]);
              }}
            >
              {columns.map((column, index) => (
                <SelectItem key={column.id} textValue={index + 1}>
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
            {isLoading ? <CircularProgress size={16} /> : " Di chuyển"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
export default MoveColumn;
