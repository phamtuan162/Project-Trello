import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useState, useRef, useMemo } from "react";
import { MoreHorizontal } from "lucide-react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import MoveColumn from "@/components/actions/column/moveColumn";
import CopyColumn from "@/components/actions/column/copyColumn";
import SortCard from "@/components/actions/column/sortCard";
import DeleteColumn from "@/components/actions/column/deleteColumn";
import { useSelector } from "react-redux";
export function ListOptions({ column }) {
  const closeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const isAdminOrOwner = useMemo(() => {
    return user.role === "admin" || user.role === "owner";
  }, [user.role]);

  const options = useMemo(
    () =>
      [
        {
          label: "Sao chép danh sách",
          component: (
            <CopyColumn column={column}>
              <span className="block w-full">Sao chép danh sách</span>
            </CopyColumn>
          ),
        },
        !isAdminOrOwner && {
          label: "Xóa danh sách",
          component: (
            <DeleteColumn column={column}>
              <span className="block w-full">Xóa danh sách</span>
            </DeleteColumn>
          ),
        },
        {
          label: "Di chuyển danh sách",
          component: (
            <MoveColumn column={column}>
              <span className="block w-full">Di chuyển danh sách</span>
            </MoveColumn>
          ),
        },
        {
          label: "Sắp xếp",
          component: (
            <SortCard column={column}>
              <span className="block w-full">Sắp xếp theo...</span>
            </SortCard>
          ),
        },
      ].filter(Boolean),
    [isAdminOrOwner]
  );
  return (
    <Popover
      placement="right"
      className="w-[304px] p-0"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button className="h-auto p-0 min-w-[30px]" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 pb-2">
        <div className=" w-full">
          <div className="flex justify-between items-center w-full relative py-2">
            <h1 className="grow text-center text-sm font-medium">Thao tác</h1>
            <Button
              className="min-w-3 rounded-lg bg-white hover:bg-default-300 text-xs p-1 absolute right-1 top-2 h-auto"
              onClick={() => setIsOpen(!isOpen)}
              ref={closeRef}
            >
              <CloseIcon />
            </Button>
          </div>
          <Listbox aria-label="Listbox Variants" className="p-0">
            {options?.map((option, index) => {
              return (
                <ListboxItem
                  className={`max-h-8  data-[hover=true]:bg-default-100 pl-4 text-lg `}
                  textValue={option.label}
                  key={index}
                  style={{ color: "#172b4d" }}
                >
                  {option.component ? option.component : option.label}
                </ListboxItem>
              );
            })}
          </Listbox>
        </div>
      </PopoverContent>
    </Popover>
  );
}
