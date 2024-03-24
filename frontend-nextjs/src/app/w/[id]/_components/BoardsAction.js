import { useState, useEffect, useRef } from "react";
import { Input } from "@nextui-org/react";
import { MoreIcon } from "@/components/Icon/MoreIcon";

import { Plus } from "lucide-react";
import { Search } from "lucide-react";
import FormPopoverBoard from "@/components/Form/FormPopoverBoard";
export function BoardsAction({ setBoards, boardsOrigin }) {
  const [isSearch, setIsSearch] = useState(false);
  const [isAction, setIsAction] = useState(false);
  const inputRef = useRef(null);
  const handleSearchBoard = async (e) => {
    const searchString = e.target.value.toLowerCase();
    const boardNeedSearch = boardsOrigin.filter((board) =>
      board.title.toLowerCase().includes(searchString)
    );
    setBoards(boardNeedSearch);
  };
  useEffect(() => {
    if (isSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearch]);
  return isSearch ? (
    <div className="my-2 lg:block hidden">
      <Input
        ref={inputRef}
        onChange={(e) => handleSearchBoard(e)}
        onBlur={() => {
          setBoards(boardsOrigin);
          setIsSearch(!isSearch);
        }}
        variant="faded"
        classNames={{
          base: "max-w-full sm:max-w-[16rem] ",
          mainWrapper: "h-full ",
          input: "text-small ",
          inputWrapper:
            "h-full font-normal text-default-500 bg-white  dark:bg-default-500/20 rounded-lg ",
        }}
        placeholder="Tìm kiếm..."
        size="sm"
        startContent={<Search size={18} />}
      />
    </div>
  ) : (
    <div
      className="w-full mb-1  justify-between items-center lg:flex hidden"
      style={{ height: "32px" }}
      onMouseOver={() => setIsAction(true)}
      onMouseOut={() => setIsAction(false)}
    >
      <span
        className="text-sm font-medium  block"
        style={{ color: "rgb(101, 111, 125)" }}
      >
        Bảng
      </span>
      {isAction ? (
        <div className=" items-center flex">
          <button className="outline-0 p-1 rounded-lg hover:bg-default-100">
            <MoreIcon size={14} />
          </button>
          <button
            className="outline-0 p-1 rounded-lg hover:bg-default-100"
            onClick={() => setIsSearch(!isSearch)}
          >
            <Search size={14} />
          </button>
          <FormPopoverBoard>
            <button className="outline-0 p-1 rounded-lg hover:bg-default-100">
              <Plus size={14} />
            </button>
          </FormPopoverBoard>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
