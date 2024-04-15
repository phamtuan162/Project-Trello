"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { createWorkApi } from "@/services/workspaceApi";
import { toast } from "react-toastify";
import { cardSlice } from "@/stores/slices/cardSlice";
const { updateCard } = cardSlice.actions;
const AddWork = ({ children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const HandleChange = (e) => {
    setTitle(e.target.value);
  };
  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    createWorkApi({ card_id: card.id, title: title }).then((data) => {
      if (data.status === 200) {
        const updatedWorks = [...card.works, data.data];
        const cardUpdate = { ...card, works: updatedWorks };
        dispatch(updateCard(cardUpdate));
      } else {
        const error = data.error;
        toast.error(error);
      }
      setIsLoading(false);
      setTitle("");
    });
  };
  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 px-3">
        <form className="w-full" onSubmit={(e) => HandleSubmit(e)}>
          <div className="flex justify-between items-center relative">
            <h1 className="grow text-center ">Thêm danh sách công việc</h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="mb-2 pt-2">
            <p className="text-xs font-medium">Tiêu đề</p>
            <div className="mt-1 flex flex-col gap-2 w-full">
              <Input
                onChange={HandleChange}
                value={title}
                name="title"
                id="title"
                size="xs"
                variant="bordered"
                aria-label="input-label"
                isRequired
              />
            </div>
          </div>

          <Button
            type="submit"
            color="primary"
            className="mt-2"
            isDisabled={user?.role?.toLowerCase() !== "admin" || isLoading}
          >
            {isLoading ? <CircularProgress /> : "Thêm"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
export default AddWork;
