"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Button,
} from "@nextui-org/react";
import { toast } from "react-toastify";

import { CloseIcon } from "@/components/Icon/CloseIcon";
import { createWorkApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";

const { createWorkInCard, updateActivityInCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const AddWork = ({ children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const HandleChange = (e) => {
    setTitle(e.target.value);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    if (title === "") {
      toast.info("Chưa nhập tiêu đề!");
      return;
    }
    await toast
      .promise(
        async () => await createWorkApi({ card_id: card.id, title: title }),
        { pending: "Đang thêm..." }
      )
      .then((res) => {
        const { work, activity } = res;

        dispatch(createWorkInCard(work));

        dispatch(updateActivityInCard(activity));

        dispatch(
          updateCardInBoard({
            id: card.id,
            column_id: card.column_id,
            works: [work, ...card.works],
            activities: [activity, ...card.activities],
          })
        );
        toast.success("Thêm work thành công");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsOpen(false);
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
            className="mt-2 interceptor-loading"
            isDisabled={!checkRole}
          >
            Thêm
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
export default AddWork;
