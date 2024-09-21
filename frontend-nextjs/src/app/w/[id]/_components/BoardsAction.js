import { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { Search, Plus } from "lucide-react";

import { MoreIcon } from "@/components/Icon/MoreIcon";
import SortBoard from "@/components/actions/board/sortBoard";
import FormPopoverBoard from "@/components/Form/FormPopoverBoard";

export function BoardsAction({ setBoards, boards }) {
  const [isSearch, setIsSearch] = useState(false);
  const [isAction, setIsAction] = useState(false);
  const inputRef = useRef(null);
  const workspace = useSelector((state) => state.workspace.workspace);
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);

  const filteredBoards = useMemo(() => {
    let filtered = workspace?.boards?.filter(Boolean) || [];

    if (hasSearchFilter) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filtered;
  }, [filterValue, workspace?.boards]);

  useEffect(() => {
    setBoards(filteredBoards);
  }, [filteredBoards]);

  useEffect(() => {
    if (isSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearch]);

  const handleSearchToggle = () => setIsSearch(!isSearch);

  const handleInputBlur = () => {
    setFilterValue("");
    handleSearchToggle();
  };

  return isSearch ? (
    <div className="my-2 lg:block hidden">
      <Input
        ref={inputRef}
        onChange={(e) => setFilterValue(e.target.value)}
        onBlur={handleInputBlur}
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

      <div className={`items-center  ${isAction ? "flex" : "hidden"}`}>
        <SortBoard setBoards={setBoards} boards={boards}>
          <button className="outline-0 p-1 rounded-lg hover:bg-default-100">
            <MoreIcon size={14} />
          </button>
        </SortBoard>

        <button
          className="outline-0 p-1 rounded-lg hover:bg-default-100"
          onClick={handleSearchToggle}
        >
          <Search size={14} />
        </button>
        <FormPopoverBoard placement={"top-right"}>
          <button className="outline-0 p-1 rounded-lg hover:bg-default-100">
            <Plus size={14} />
          </button>
        </FormPopoverBoard>
      </div>
    </div>
  );
}
