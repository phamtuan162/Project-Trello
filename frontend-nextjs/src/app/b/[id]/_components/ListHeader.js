import { useState, useEffect, useRef } from "react";
import { updateColumnDetail } from "@/services/workspaceApi";
import { ListOptions } from "./ListOptions";
import { toast } from "react-toastify";
export function ListHeader({
  column,
  deleteColumnDetail,
  createNewCard,
  updateColumn,
}) {
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onUpdateTitle = async () => {
    const title = inputRef.current.value.trim();

    if (title && title !== column.title.trim()) {
      updateColumn(column.id, { title: title });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      inputRef.current.blur();
    }
  };
  return (
    <div className=" px-2 pt-0 pb-2 text-sm font-semibold flex justify-between items-start- gap-x-2">
      <div className="h-[30px] grow">
        {isEditing ? (
          <input
            ref={inputRef}
            name="title"
            id="title"
            defaultValue={column.title}
            className="h-full text-lg rounded-md focus-visible:border-sky-600 w-full pl-3"
            style={{ border: "none" }}
            onBlur={() => onUpdateTitle()}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className="text-lg  ml-4 w-full block"
            onClick={() => setIsEditing(!isEditing)}
          >
            {column.title}
          </span>
        )}
      </div>

      <ListOptions
        column={column}
        deleteColumnDetail={deleteColumnDetail}
        createNewCard={createNewCard}
      />
    </div>
  );
}
