"use client";
import { Checkbox, Button, Avatar } from "@nextui-org/react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Clock, UserPlus, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

import { CloseIcon } from "@/components/Icon/CloseIcon";
import { updateMissionApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { missionSlice } from "@/stores/slices/missionSlice";
import { boardSlice } from "@/stores/slices/boardSlice";

import AssignUserMission from "@/components/actions/mission/AssignUserMission";
import SetDate from "@/components/actions/mission/setDate";
import DeleteAndTransferMission from "@/components/actions/mission/deleteAndTransferMission";
import { cloneDeep } from "lodash";

const { updateMissionInCard } = cardSlice.actions;
const { updateMissionInMissions } = missionSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const MissionWork = ({ mission, setMissionSelected }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const formRef = useRef(null);

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 1000);
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

  const onSubmit = async (formData) => {
    const name = formData.get("name");

    if (!name) {
      toast.info("Chưa nhập name!");
      return;
    }

    await toast
      .promise(async () => await updateMissionApi(mission.id, { name: name }), {
        pending: "Đang cập nhật...",
      })
      .then((res) => {
        const works = cloneDeep(card.works);

        const workUpdate = works.find((w) => w.id === mission.work_id);

        const missionUpdate = workUpdate.missions.find(
          (m) => m.id === mission.id
        );

        missionUpdate.name = name;

        dispatch(
          updateMissionInCard({
            id: mission.id,
            work_id: mission.work_id,
            name: name,
          })
        );

        dispatch(
          updateCardInBoard({
            id: card.id,
            column_id: card.column_id,
            works,
          })
        );

        if (mission.user_id === user.id) {
          dispatch(updateMissionInMissions({ id: mission.id, name: name }));
        }

        setIsEditing(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="flex gap-1 items-start ">
      {checkRole ? (
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
              defaultValue={mission?.name}
              size="xs"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Button
                  type="submit"
                  size="sm"
                  radius="lg"
                  color="primary"
                  className="font-medium interceptor-loading"
                >
                  Lưu
                </Button>
                <span
                  className="interceptor-loading"
                  onClick={() => disableEditing()}
                >
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
                checkRole && enableEditing();
              }}
            >
              {mission?.name}
            </span>

            <div className="flex gap-2 ">
              <SetDate mission={mission}>
                {mission?.endDateTime ? (
                  <span
                    className={`${
                      mission.status === "success" && "bg-green-700 text-white"
                    } ${
                      mission.status === "up_expired" &&
                      "bg-yellow-400 text-white"
                    } ${
                      mission.status === "expired" && "bg-red-700 text-white"
                    }${
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
                {mission?.user ? (
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
              {checkRole && (
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
