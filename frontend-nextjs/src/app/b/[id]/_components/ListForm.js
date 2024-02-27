"use client";
import { Input, Button } from "@nextui-org/react";
import { AddIcon } from "@/components/Icon/AddIcon";
import { useState, useRef, useEffect } from "react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
export function ListForm({ createNewColumn }) {
  const inputRef = useRef(null);
  const btnaddRef = useRef(null);
  const [isCreate, setIsCreate] = useState(false);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreate]);
  const createColumn = async () => {
    const title = inputRef.current.value.trim();
    if (title) {
      createNewColumn({ title: title });
      setIsCreate(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      btnaddRef.current.click();
    }
  };

  return (
    <li className="shrink-0 h-full w-[272px] select-none   ">
      {isCreate ? (
        <>
          <div
            className="fixed z-40 "
            style={{ inset: "0" }}
            onClick={() => setIsCreate(false)}
          ></div>
          <form className="w-full rounded-md bg-[#f1f2f4] shadow-md p-2 relative  z-50 column">
            <Input
              isRequired
              ref={inputRef}
              size={"sm"}
              variant={"bordered"}
              type="text"
              placeholder="Nhập tiêu đề..."
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center gap-x-2 mt-2">
              <Button
                type="submit"
                color="primary"
                ref={btnaddRef}
                onClick={() => createColumn()}
              >
                Thêm danh sách
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="min-w-3 rounded-lg bg-inherit hover:bg-default-300 text-xs p-2 border-0"
                onClick={() => setIsCreate(!isCreate)}
              >
                <CloseIcon />
              </Button>
            </div>
          </form>
        </>
      ) : (
        <button
          className="column w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm relative  z-50"
          onClick={() => setIsCreate(true)}
        >
          <AddIcon />
          <span className="ml-2">Thêm danh sách khác</span>
        </button>
      )}
    </li>
  );
}
