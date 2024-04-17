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
  const workspaces = useMemo(() => {
    return user?.workspaces?.filter((workspace) => workspace.boards.length > 0);
  }, [user]);
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
    if (+valueBoard === +column.board_id) {
      if (+column.id !== +valueColumn) {
        const oldColumnIndex = columns.findIndex((c) => +c.id === +column.id);
        const newColumnIndex = columns.findIndex((c) => +c.id === +valueColumn);
        const dndOrderedColumns = arrayMove(
          columns,
          oldColumnIndex,
          newColumnIndex
        );
        const newBoard = { ...board };
        const newColumns = [...dndOrderedColumns];

        const dndOrderedColumnsIds = newColumns.map((c) => c.id);

        newBoard.columns = newColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;

        updateBoardDetail(newBoard.id, {
          columnOrderIds: dndOrderedColumnsIds,
        }).then((data) => {
          if (data.status === 200) {
            dispatch(updateBoard(newBoard));
            dispatch(updateColumn(newColumns));
          } else {
            const error = data.error;
            toast.error(error);
          }
          setIsLoading(false);
        });
      }
    } else {
      const boardActive = cloneDeep(board);
      const boardOver = cloneDeep(boardMove);

      const newColumnIndex = columns.findIndex(
        (item) => item.id === +valueColumn
      );

      if (boardActive) {
        boardActive.columns = boardActive.columns.filter(
          (item) => item.id !== column.id
        );

        boardActive.columnOrderIds = boardActive.columns.map((item) => item.id);
      }

      if (boardOver) {
        boardOver.columns = boardOver.columns.filter(
          (item) => item.id !== column.id
        );
        const rebuild_activeDraggingColumnData = {
          ...column,
          board_id: boardOver.id,
        };
        boardOver.columns = boardOver.columns.toSpliced(
          newColumnIndex,
          0,
          rebuild_activeDraggingColumnData
        );
        boardOver.columnOrderIds = boardOver.columns.map((item) => item.id);
      }
      moveColumnToDifferentBoardAPI(column.id, {
        user_id: user.id,
        boardActive,
        boardOver,
      }).then((data) => {
        if (data.status === 200) {
          dispatch(updateBoard(boardActive));
          dispatch(updateColumn(boardActive.columns));
        } else {
          const error = data.error;
          toast.error(error);
        }
        setIsLoading(false);
      });
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
        <form className="w-full" onSubmit={(e) => HandleSubmit(e)}>
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
