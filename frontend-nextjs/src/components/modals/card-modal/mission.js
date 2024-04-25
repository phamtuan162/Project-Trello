"use client";
import { Checkbox, Button, Avatar } from "@nextui-org/react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { updateMissionApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { toast } from "react-toastify";
import { Clock, UserPlus, MoreHorizontal } from "lucide-react";
import AssignUserMission from "@/components/actions/mission/AssignUserMission";
import SetDate from "@/components/actions/mission/setDate";
import DeleteAndTransferMission from "@/components/actions/mission/deleteAndTransferMission";
import { format } from "date-fns";
const { updateCard } = cardSlice.actions;
const MissionWork = ({ mission, setMissionSelected }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const formRef = useRef(null);
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

  const onSubmit = (formData) => {
    const name = formData.get("name");
    const updatedWorks = card.works.map((work) => {
      if (+work.id === +mission.work_id) {
        const updatedMissions = work.missions.map((item) => {
          if (+item.id === +mission.id) {
            return { ...mission, name: name };
          }
          return mission;
        });
        return { ...work, missions: updatedMissions };
      }
      return work;
    });
    const updatedCard = { ...card, works: updatedWorks };
    if (name) {
      updateMissionApi(mission.id, { name: name }).then((data) => {
        if (data.status === 200) {
          dispatch(updateCard(updatedCard));
        } else {
          const error = data.error;
          toast.error(error);
        }
        setIsEditing(false);
      });
    }
  };
  return (
    <div className="flex gap-1 items-start ">
      {user?.role?.toLowerCase() === "admin" ||
      user?.role?.toLowerCase() === "owner" ? (
        <Checkbox
          value={mission.id}
          key={mission.id}
          onClick={() => {
            setMissionSelected(mission);
          }}
        ></Checkbox>
      ) : (
        <span className="w-[26px]"></span>
      )}

      <div
        className={`hover:bg-default-100 rounded-lg p-2 grow cursor-pointer ${
          isEditing && "bg-default-100"
        } `}
      >
        {isEditing ? (
          <form
            className="flex flex-col gap-2 w-full"
            ref={formRef}
            action={onSubmit}
          >
            <input
              name="name"
              className=" rounded-md focus-visible:outline-none border-sky-600 w-full text-xs p-2 pt-0  w-full h-[40px] border-2"
              ref={inputRef}
              defaultValue={mission?.name || undefined}
              size="xs"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Button
                  type="submit"
                  size="sm"
                  radius="lg"
                  color="primary"
                  className="font-medium"
                >
                  Lưu
                </Button>
                <span onClick={() => disableEditing()}>
                  <CloseIcon size={20} />
                </span>
              </div>

              <div className="flex gap-2 ">
                <SetDate mission={mission}>
                  <button className="focus-visible:outline-0 p-2 text-xs flex items-center justify-center rounded-sm  hover:bg-gray-300">
                    <Clock size={14} />
                    <span className="ml-1">
                      {mission?.endDateTime
                        ? format(mission?.endDateTime, "d 'tháng' M ")
                        : "Ngày hết hạn"}
                    </span>
                  </button>
                </SetDate>

                <AssignUserMission mission={mission}>
                  <button className="focus-visible:outline-0 p-2 text-xs flex items-center justify-center rounded-sm  hover:bg-gray-300">
                    <UserPlus size={14} />
                    <span className="ml-1">
                      {mission?.user ? user.name : " Chỉ định"}
                    </span>
                  </button>
                </AssignUserMission>

                <DeleteAndTransferMission mission={mission}>
                  <button className="focus-visible:outline-0 p-2 text-xs flex items-center justify-center rounded-sm hover:bg-gray-300">
                    <MoreHorizontal size={14} />
                  </button>
                </DeleteAndTransferMission>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-center   w-full h-[20px]">
            <span
              className={`grow text-xs font-semibold leading-4 ${
                mission.status === "success" && "line-through"
              }`}
              onClick={() => {
                if (
                  user?.role?.toLowerCase() === "admin" ||
                  user?.role?.toLowerCase() === "owner"
                ) {
                  enableEditing();
                }
              }}
            >
              {mission.name}
            </span>

            <div className="flex gap-2 ">
              <SetDate mission={mission}>
                {mission.endDateTime ? (
                  <span
                    className={`${
                      mission.status === "success" && "bg-green-700 text-white"
                    } ${
                      mission.status === "expired" && "bg-red-700 text-white"
                    } ${
                      (mission.status === "pending" || !mission.status) &&
                      "bg-gray-200"
                    }
                    text-xs px-1.5 flex items-center justify-center  rounded-full gap-1 `}
                  >
                    <Clock size={14} />
                    {format(mission?.endDateTime, "d 'tháng' M ")}
                  </span>
                ) : (
                  <button className="focus-visible:outline-0 h-[24px] w-[24px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300">
                    <Clock size={14} />
                  </button>
                )}
              </SetDate>

              <AssignUserMission mission={mission}>
                {mission.user ? (
                  <div className="group-avatar-1">
                    <Avatar
                      src={mission.user.avatar}
                      name={mission.user.name.charAt(0).toUpperCase()}
                      radius="full"
                      color="secondary"
                    />
                  </div>
                ) : (
                  <button className="focus-visible:outline-0 h-[24px] w-[24px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300">
                    <UserPlus size={14} />
                  </button>
                )}
              </AssignUserMission>
              {(user?.role?.toLowerCase() === "admin" ||
                user?.role?.toLowerCase() === "owner") && (
                <DeleteAndTransferMission mission={mission}>
                  <button className="focus-visible:outline-0 h-[24px] w-[24px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300">
                    <MoreHorizontal size={14} />
                  </button>
                </DeleteAndTransferMission>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MissionWork;
