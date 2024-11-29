"use client";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Progress, Button } from "@nextui-org/react";
import { useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { updateWorkApi } from "@/services/workspaceApi";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { SquareCheck } from "@/components/Icon/SquareCheck";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import DeleteWork from "@/components/actions/work/deleteWork";
import AddMission from "@/components/actions/mission/addMission";
import MissionsWork from "./missions";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const WorkCard = ({ work }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const formRef = useRef(null);

  // Tiến độ danh sách việc làm
  const progressWork = useMemo(() => {
    if (!work?.missions?.length) return 0;

    const completedMissions = work.missions.filter(
      (mission) => mission.status === "success"
    ).length;

    const progressPercentage = (completedMissions / work.missions.length) * 100;

    return Math.round(progressPercentage * 100) / 100; // Làm tròn tới 2 chữ số thập phân
  }, [work]);

  const missions = useMemo(() => {
    return (
      work?.missions
        ?.slice()
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) || []
    );
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
  const onSubmit = async (formData) => {
    const title = formData.get("title");

    if (title === "") {
      toast.info("Chưa nhập tiêu đề!");
      return;
    }

    await toast
      .promise(async () => await updateWorkApi(work.id, { title: title }), {
        pending: "Đang cập nhật...",
      })
      .then((res) => {
        const worksUpdate = card.works.map((w) => {
          if (w.id === work.id) return { ...w, title: title };
          return w;
        });

        dispatch(updateCard({ works: worksUpdate }));

        dispatch(
          updateCardInBoard({
            id: card.id,
            column_id: card.column_id,
            works: worksUpdate,
          })
        );

        toast.success("Cập nhật thành công");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsEditing(false);
      });
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
              defaultValue={work?.title}
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
        <span
          style={{ fontSize: "10px" }}
          className=" w-[22px] shrink-0 text-center"
        >
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
