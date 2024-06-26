"use client";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { SquareCheck } from "@/components/Icon/SquareCheck";
import { Progress, Button } from "@nextui-org/react";
import { updateWorkApi } from "@/services/workspaceApi";
import { useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cardSlice } from "@/stores/slices/cardSlice";
import { toast } from "react-toastify";
import DeleteWork from "@/components/actions/work/deleteWork";
import AddMission from "@/components/actions/mission/addMission";
import MissionsWork from "./missions";

const { updateCard } = cardSlice.actions;
const WorkCard = ({ work }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  // Tiến độ danh sách việc làm
  const progressWork = useMemo(() => {
    if (!work || !work.missions || work.missions.length === 0) {
      return 0;
    }

    const completedMissions = work.missions.filter(
      (mission) => mission.status === "success"
    );

    let progressPercentage =
      (completedMissions.length / work.missions.length) * 100;

    if (progressPercentage % 1 !== 0) {
      return progressPercentage.toFixed(2);
    }

    return progressPercentage;
  }, [work]);
  const missions = useMemo(() => {
    return work?.missions
      ? [...work.missions].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )
      : [];
  }, [work]);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);

  useOnClickOutside(formRef, disableEditing);

  //Sửa tiêu đề danh sách việc làm
  const onSubmit = (formData) => {
    const title = formData.get("title");
    if (title !== "") {
      updateWorkApi(work.id, { title: title }).then((data) => {
        if (data.status === 200) {
          const workNew = data.data;
          const worksUpdate = card.works.map((workItem) =>
            workItem.id === workNew.id ? workNew : workItem
          );
          const cardUpdate = { ...card, works: worksUpdate };
          dispatch(updateCard(cardUpdate));
        } else {
          const error = data.error;
          toast.error(error);
        }
        setIsEditing(false);
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-x-4 w-full">
        <span className="mt-1">
          <SquareCheck size={22} />
        </span>

        {isEditing ? (
          <form
            className="flex flex-col gap-4 w-full"
            ref={formRef}
            action={onSubmit}
          >
            <input
              name="title"
              className=" rounded-md focus-visible:outline-none border-sky-600 w-full text-xs p-2  w-full h-[40px] border-2"
              ref={inputRef}
              defaultValue={work?.title || undefined}
              size="xs"
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" size="sm" radius="lg" color="primary">
                Lưu
              </Button>
              <span onClick={() => disableEditing()}>
                <CloseIcon size={20} />
              </span>
            </div>
          </form>
        ) : (
          <div className="flex items-center mt-1  w-full">
            <span
              className="grow text-xs font-semibold"
              onClick={() => {
                if (
                  user?.role?.toLowerCase() === "admin" ||
                  user?.role?.toLowerCase() === "owner"
                ) {
                  enableEditing();
                }
              }}
            >
              {work.title}
            </span>
            <DeleteWork work={work} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-4 w-full ">
        <span style={{ fontSize: "10px" }} className=" w-[22px] shrink-0 ">
          {progressWork}%
        </span>
        <Progress size="md" radius="md" value={progressWork} />
      </div>
      {missions?.length > 0 && <MissionsWork missions={missions} />}
      <div className="flex items-center gap-x-4 w-full ">
        <div className="w-[22px]"></div>
        <AddMission work={work} />
      </div>
    </div>
  );
};
export default WorkCard;
