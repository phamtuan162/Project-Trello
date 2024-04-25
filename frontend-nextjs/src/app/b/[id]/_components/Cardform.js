import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/react";
import { useRef, useState, useEffect } from "react";
import { AddIcon } from "@/components/Icon/AddIcon";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { useSelector } from "react-redux";

export function CardForm({ createNewCard, column }) {
  const textareaRef = useRef(null);
  const btnaddRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const workspace = useSelector((state) => state.workspace.workspace);
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const onCreateCard = async () => {
    const trimmedValue = textareaRef.current.value.trim();
    if (trimmedValue) {
      createNewCard({ title: trimmedValue }, column.id);
    }
    setIsEditing(false);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      textareaRef.current.blur();
    }
  };
  if (
    user?.role?.toLowerCase() !== "admin" &&
    user?.role?.toLowerCase() !== "owner"
  ) {
    return;
  }
  return isEditing ? (
    <div className="p-2 pb-0">
      <Textarea
        placeholder="Nhập tiêu đề cho thẻ..."
        ref={textareaRef}
        className="text-lg"
        maxRows={1}
        onBlur={() => onCreateCard()}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center gap-x-2 mt-2">
        <Button color="primary" onClick={() => onCreateCard()} ref={btnaddRef}>
          Thêm danh sách
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
