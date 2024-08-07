"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useMemo, useCallback } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Button, Textarea, CircularProgress } from "@nextui-org/react";
import { createMissionApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { toast } from "react-toastify";
const { updateCard } = cardSlice.actions;
const AddMission = ({ work }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const formRef = useRef(null);
  const btnRef = useRef();

  const checkRole = useMemo(() => {
    return (
      user?.role?.toLowerCase() !== "admin" &&
      user?.role?.toLowerCase() !== "owner"
    );
  }, [user]);

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
    // if (e.key === "Enter") {
    //   btnRef.current.click();
    // }
  };

  useOnClickOutside(formRef, disableEditing);

  const onSubmit = useCallback(async (formData) => {
    const name = formData.get("name");

    if (!name) {
      return;
    }

    try {
      setIsLoading(true);
      const data = await createMissionApi({
        name: name,
        work_id: work.id,
        status: "pending",
      });

      if (data.status === 200) {
        const missionNew = data.data;

        const worksUpdate = card.works.map((item) => {
          if (+item.id === +work.id) {
            const missionsUpdate = item.missions
              ? [...item.missions, missionNew]
              : [missionNew];
            return { ...item, missions: missionsUpdate };
          }
          return item;
        });

        const cardUpdate = { ...card, works: worksUpdate };
        dispatch(updateCard(cardUpdate));
        setIsEditing(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while creating the mission.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (checkRole) {
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
        placeholder="Thêm một mục"
        classNames={{
          input: "resize-y min-h-[20px] h-[20px]",
        }}
      />
      <div className="flex items-center gap-x-2">
        <Button
          disabled={isLoading}
          ref={btnRef}
          type="submit"
          size="sm"
          radius="lg"
          color="primary"
        >
          {isLoading ? <CircularProgress size={20} /> : "Thêm"}
        </Button>
        <Button
          disabled={isLoading}
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
