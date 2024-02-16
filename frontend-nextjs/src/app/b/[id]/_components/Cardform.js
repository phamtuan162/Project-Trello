import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/react";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AddIcon } from "@/components/Icon/AddIcon";
import { CloseIcon } from "@/components/Icon/CloseIcon";

export function CardForm({ createNewCard, column }) {
  const textareaRef = useRef(null);
  const btnaddRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const onCreateCard = async () => {
    const trimmedValue = textareaRef.current.value.trim();
    if (trimmedValue) {
      createNewCard({ title: trimmedValue }, column.id);
      toast.success("Thêm danh sách thành công");
    }
    setIsEditing(false);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      btnaddRef.current.click();
    }
  };

  return isEditing ? (
    <div className="p-2 ">
      <Textarea
        placeholder="Nhập tiêu đề cho thẻ..."
        ref={textareaRef}
        className="text-lg"
        maxRows={2}
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
    <div className="pt-2 px-2">
      <Button
        className="bg-[#f1f2f4] hover:bg-default-300 rounded-lg h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        size="sm"
        onClick={() => setIsEditing(!isEditing)}
      >
        <AddIcon />
        Add a card
      </Button>
    </div>
  );
}
