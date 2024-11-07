import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { AddIcon } from "@/components/Icon/AddIcon";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { createCard } from "@/services/workspaceApi";
import { toast } from "react-toastify";
import { boardSlice } from "@/stores/slices/boardSlice";

const { updateBoard } = boardSlice.actions;
export function CardForm({ column }) {
  const dispatch = useDispatch();
  const textareaRef = useRef(null);
  const btnAddRef = useRef(null);
  const formRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const workspace = useSelector((state) => state.workspace.workspace);
  const [isEditing, setIsEditing] = useState(false);
  const isHandlingClick = useRef(false);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }

    const handleClickOutside = async (event) => {
      // Nếu đang xử lý click trước đó thì bỏ qua sự kiện này
      if (isHandlingClick.current) return;

      // Đánh dấu là đang xử lý click
      isHandlingClick.current = true;

      if (formRef.current && !formRef.current.contains(event.target)) {
        const title = textareaRef.current.value.trim();
        if (title === "") {
          setIsEditing(false);
        } else {
          btnAddRef.current.click();
        }
      }

      // Sau khi xử lý xong, reset flag
      setTimeout(() => {
        isHandlingClick.current = false;
      }, 300); // Tạm dừng 300ms trước khi chấp nhận click tiếp theo
    };

    // Đăng ký event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Hủy bỏ event listener khi component unmount hoặc isEditing thay đổi
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const createNewCard = async () => {
    const trimmedValue = textareaRef.current.value.trim();

    if (trimmedValue.length < 3) {
      toast.error("Title thẻ phải ít nhất 3 ký tự");
      return;
    }

    try {
      const { status, data } = await createCard({
        title: trimmedValue,
        workspace_id: workspace.id,
        column_id: column.id,
      });

      if (status >= 200 && status < 300) {
        const createdCard = data;
        const updatedColumns = board.columns.map((item) => {
          if (+item.id !== +column.id) return item;

          const isPlaceholderExist = item.cards.some(
            (card) => card.FE_PlaceholderCard
          );
          return {
            ...item,
            cards: isPlaceholderExist
              ? [createdCard]
              : [...item.cards, createdCard],
            cardOrderIds: isPlaceholderExist
              ? [createdCard.id]
              : [...item.cardOrderIds, createdCard.id],
          };
        });

        dispatch(updateBoard({ ...board, columns: updatedColumns }));
        toast.success("Tạo thẻ thành công");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      btnAddRef.current.click();
    }
  };

  if (
    user?.role?.toLowerCase() !== "admin" &&
    user?.role?.toLowerCase() !== "owner"
  ) {
    return null;
  }

  return isEditing ? (
    <div className="p-2 pb-0" ref={formRef}>
      <Textarea
        placeholder="Nhập tiêu đề cho thẻ..."
        ref={textareaRef}
        className="text-lg"
        maxRows={1}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center gap-x-2 mt-2">
        <Button
          className="interceptor-loading"
          color="primary"
          onClick={() => createNewCard()}
          ref={btnAddRef}
        >
          Thêm thẻ
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="min-w-3 rounded-lg bg-inherit hover:bg-default-300 text-xs p-2 border-0"
          onClick={() => setIsEditing(!isEditing)}
        >
          <CloseIcon />
        </Button>
      </div>
    </div>
  ) : (
    <div className="pt-2 px-2 pb-0">
      <Button
        className="card bg-[#f1f2f4] hover:bg-default-300 rounded-lg h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        size="sm"
        onClick={() => setIsEditing(!isEditing)}
      >
        <AddIcon />
        Add a card
      </Button>
    </div>
  );
}
