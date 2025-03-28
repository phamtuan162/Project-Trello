import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

import { AddIcon } from "@/components/Icon/AddIcon";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { createCard } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";

const { createCardInBoard } = boardSlice.actions;

export function CardForm({ column }) {
  const dispatch = useDispatch();
  const textareaRef = useRef(null);
  const btnAddRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const createNewCard = async () => {
    try {
      const trimmedValue = textareaRef.current.value.trim();

      if (trimmedValue.length < 3) {
        toast.info("Tiêu đề thẻ phải ít nhất 3 ký tự");
        return;
      }

      await toast
        .promise(
          async () =>
            await createCard({
              title: trimmedValue,
              workspace_id: workspace.id,
              column_id: column.id,
            }),
          { pending: "Đang tạo..." }
        )
        .then((res) => {
          const { data } = res;
          dispatch(createCardInBoard(data));
          toast.success("Tạo thẻ thành công");
        })
        .catch((error) => {
          console.log(error);
        });
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
    <div className="p-2 pb-0">
      <Textarea
        placeholder="Nhập tiêu đề cho thẻ..."
        ref={textareaRef}
        className="text-lg"
        maxRows={1}
        onKeyDown={handleKeyDown}
        onBlur={() => setIsEditing(false)}
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
