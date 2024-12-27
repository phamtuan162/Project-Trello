"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useMemo, useCallback } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Button, Textarea } from "@nextui-org/react";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";

import { createMissionApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { socket } from "@/socket";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const AddMission = ({ work }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const formRef = useRef(null);
  const btnRef = useRef(null);

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      disableEditing();
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      btnRef.current?.click(); // Thay thế bằng click nút "Thêm"
    }
  };

  useOnClickOutside(formRef, disableEditing);

  const onSubmit = async (formData) => {
    try {
      const name = formData.get("name");

      if (!name) {
        toast.info("Chưa nhập name!");
        return;
      }

      await toast
        .promise(
          async () =>
            await createMissionApi({
              name: name,
              work_id: work.id,
              status: "pending",
            }),
          { pending: "Đang thêm..." }
        )
        .then((res) => {
          const { data: missionCreated } = res;
          const works = cloneDeep(card.works);

          const workUpdate = works.find((w) => w.id === work.id);

          if (workUpdate?.missions?.length) {
            workUpdate.missions.push(missionCreated);
          } else {
            workUpdate.missions = [missionCreated];
          }

          const cardUpdate = {
            id: card.id,
            column_id: card.column_id,
            works,
          };

          dispatch(updateCard(cardUpdate));

          dispatch(updateCardInBoard(cardUpdate));

          toast.success("Thêm mission thành công!");

          socket.emit("updateCard", cardUpdate);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsEditing(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  if (!checkRole) {
    return null;
  }

  return isEditing ? (
    <form
      className="flex flex-col gap-4 w-full"
      ref={formRef}
      action={onSubmit}
    >
      <Textarea
        onKeyDown={onKeyDown}
        name="name"
        variant="bordered"
        className="w-full mt-2 text-sm rounded-sm"
        ref={textareaRef}
        disableAnimation
        disableAutosize
        placeholder="Thêm một mục..."
        classNames={{
          input: "resize-y min-h-[20px] h-[20px]",
        }}
      />
      <div className="flex items-center gap-x-2">
        <Button
          ref={btnRef}
          className="interceptor-loading"
          type="submit"
          size="sm"
          radius="lg"
          color="primary"
        >
          Thêm
        </Button>
        <Button
          type="button"
          size="sm"
          radius="lg"
          className="text-xs bg-gray-200 interceptor-loading"
          onClick={() => disableEditing()}
        >
          Hủy
        </Button>
      </div>
    </form>
  ) : (
    <button
      className="text-xs p-1 px-2  rounded-sm bg-gray-100 hover:bg-gray-200"
      onClick={() => enableEditing()}
    >
      Thêm một mục
    </button>
  );
};
export default AddMission;
