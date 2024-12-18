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
import { cloneDeep } from "lodash";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-toastify";

import { mapOrder } from "@/utils/sorts";
import { moveColumnToDifferentBoardAPI } from "@/services/workspaceApi";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { getBoardDetail } from "@/services/workspaceApi";
import { updateBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { socket } from "@/socket";

const { updateBoard } = boardSlice.actions;
const { updateActivitiesInWorkspace } = workspaceSlice.actions;

const MoveColumn = ({ children, column }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const board = useSelector((state) => state.board.board);
  const [boardMove, setBoardMove] = useState(board);
  const [valueColumn, setValueColumn] = useState(column.id);
  const [isOpen, setIsOpen] = useState(false);

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const onSelectBoard = async (boardIdSelect) => {
    if (+boardIdSelect === +board.id) {
      if (+boardIdSelect !== +boardMove.id) {
        setBoardMove(board);
        setValueColumn(column.id);
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

          if (BoardNew.columns.length > 0) {
            BoardNew.columns = mapOrder(
              BoardNew.columns,
              BoardNew.columnOrderIds,
              "id"
            );
          }

          setBoardMove(BoardNew);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const moveColumnToDifferentBoard = async () => {
    const boardActive = cloneDeep(board);
    const boardOver = cloneDeep(boardMove);

    const newColumnIndex = boardMove.columns.findIndex(
      (c) => c.id === +valueColumn
    );

    // Cập nhật columns và columnOrderIds của board hiện tại
    boardActive.columns = boardActive.columns.filter((c) => c.id !== column.id);
    boardActive.columnOrderIds = boardActive.columns.map((c) => c.id);

    // Cập nhật board_id của column di chuyển
    const updatedColumn = { ...column, board_id: boardOver.id };

    // board chuyển qua có column
    if (newColumnIndex !== -1) {
      // Cập nhật columns và columnOrderIds của board chuyển qua
      boardOver.columns = boardOver.columns.toSpliced(
        newColumnIndex,
        0,
        updatedColumn
      );
      boardOver.columnOrderIds = boardOver.columns.map((c) => c.id);
    }
    // board chuyển qua không có column nào
    else {
      boardOver.columnOrderIds = [updatedColumn.id];
    }

    await toast
      .promise(
        moveColumnToDifferentBoardAPI(column.id, {
          user_id: user.id,
          boardActive,
          boardOver,
        }),
        { pending: "Đang di chuyển..." }
      )
      .then((res) => {
        const { activity } = res;
        // Cập nhật lại state
        dispatch(
          updateBoard({
            columns: boardActive.columns,
            columnOrderIds: boardActive.columnOrderIds,
          })
        );

        dispatch(updateActivitiesInWorkspace(activity));

        toast.success("Di chuyển danh sách thẻ thành công");

        socket.emit("updateBoard", {
          columns: boardActive.columns,
          columnOrderIds: boardActive.columnOrderIds,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsOpen(false);
      });
  };

  const moveColumnWithinBoard = async () => {
    const newColumns = arrayMove(
      board.columns,
      board.columns.findIndex((c) => +c.id === +column.id),
      board.columns.findIndex((c) => +c.id === +valueColumn)
    );

    const newColumnOrderIds = newColumns.map((c) => c.id);

    await toast
      .promise(
        updateBoardDetail(board.id, { columnOrderIds: newColumnOrderIds }),
        { pending: "Đang di chuyển..." }
      )
      .then((res) => {
        // Cập nhật lại state
        dispatch(
          updateBoard({
            columns: newColumns,
            columnOrderIds: newColumnOrderIds,
          })
        );
        toast.success("Di chuyển danh sách thẻ thành công");

        socket.emit("updateBoard", {
          columns: newColumns,
          columnOrderIds: newColumnOrderIds,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsOpen(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra đây có phải vị trí hiện tại của column không?
    if (+column.id === +valueColumn) {
      toast.info("Đây là vị trí hiện tại của danh sách thẻ");
      return;
    }

    try {
      // Trường hợp 1: Di chuyển column sang board khác
      if (+boardMove.id !== +board.id) {
        await moveColumnToDifferentBoard();
      }
      // Trường hợp 2: Di chuyển column trong cùng board
      else {
        await moveColumnWithinBoard();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleReset = async () => {
    setBoardMove(board);
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
              onClick={() => setIsOpen(false)}
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="w-full mt-3">
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
              {boardMove?.columns?.length > 0 ? (
                boardMove?.columns?.map((column, index) => (
                  <SelectItem key={column.id} textValue={index + 1}>
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
export default MoveColumn;
