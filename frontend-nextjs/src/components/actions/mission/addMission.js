"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Button, Textarea, CircularProgress } from "@nextui-org/react";
import { createMissionApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
const { updateCard } = cardSlice.actions;
const AddMission = ({ work }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const formRef = useRef(null);

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
    if (e.key === "Enter") {
      formRef.current.action();
    }
  };

  useEventListener("keydown", onKeyDown);

  useOnClickOutside(formRef, disableEditing);

  const onSubmit = (formData) => {
    setIsLoading(true);
    const name = formData.get("name");
    if (name) {
      createMissionApi({ name: name, work_id: work.id }).then((data) => {
        if (data.status === 200) {
          const missionNew = data.data;
          const worksUpdate = card.works.map((item) => {
            if (+item.id === +work.id) {
              const missionsUpdate = item.missions
                ? item.missions.concat(missionNew)
                : [missionNew];
              return { ...item, missions: missionsUpdate };
            }
            return item;
          });
          const cardUpdate = { ...card, works: worksUpdate };
          dispatch(updateCard(cardUpdate));
        } else {
          const error = data.error;
          toast.error(error);
        }
        setIsEditing(false);
        setIsLoading(false);
      });
    }
  };

  if (user.role.toLowerCase() !== "admin") {
    return;
  }
  return isEditing ? (
    <form
      className="flex flex-col gap-4 w-full"
      ref={formRef}
      action={onSubmit}
    >
      <Textarea
        name="name"
        variant="bordered"
        className="w-full mt-2 text-sm rounded-sm"
        ref={textareaRef}
        disableAnimation
        disableAutosize
        placeholder="Thêm một mục"
        classNames={{
          input: "resize-y min-h-[20px] h-[20px]",
        }}
      />
      <div className="flex items-center gap-x-2">
        <Button type="submit" size="sm" radius="lg" color="primary">
          {isLoading ? <CircularProgress size={20} /> : "Thêm"}
        </Button>
        <Button
          type="button"
          size="sm"
          radius="lg"
          className="text-xs bg-gray-200"
          onClick={() => disableEditing()}
        >
          {isLoading ? <CircularProgress size={20} /> : "Hủy"}
        </Button>
      </div>
    </form>
  ) : (
    <button
      className="text-xs p-1 px-2  rounded-sm bg-gray-200"
      onClick={() => enableEditing()}
    >
      Thêm một mục
    </button>
  );
};
export default AddMission;
