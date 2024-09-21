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
import { updateFileApi } from "@/services/workspaceApi";
const { updateCard } = cardSlice.actions;
const EditNameFile = ({ children, attachment }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(attachment.fileName);
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  const HandleChange = (e) => {
    setName(e.target.value);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await updateFileApi(attachment.id, { fileName: name });

      if (data.status === 200) {
        const attachmentUpdates = card.attachments.map((attachment) =>
          +attachment.id === +data.data.id ? data.data : attachment
        );

        const cardUpdate = {
          ...card,
          attachments: attachmentUpdates,
        };

        dispatch(updateCard(cardUpdate));
        setIsOpen(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while updating the file.");
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="grow text-center ">Sửa Tệp đính kèm</h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="mb-2 pt-2">
            <p className="text-xs font-medium">Liên kết tên</p>
            <div className="mt-1 flex flex-col gap-2 w-full">
              <Input
                onChange={HandleChange}
                value={name}
                name="name"
                id="name"
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
            isDisabled={
              (user?.role?.toLowerCase() !== "admin" &&
                user?.role?.toLowerCase() !== "owner") ||
              isLoading
            }
          >
            {isLoading ? <CircularProgress /> : "Cập nhật"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
export default EditNameFile;
