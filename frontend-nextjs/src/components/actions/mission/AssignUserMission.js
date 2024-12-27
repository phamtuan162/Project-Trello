"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Button,
  User,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { SearchIcon, Check } from "lucide-react";

import { CloseIcon } from "@/components/Icon/CloseIcon";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { updateMissionApi } from "@/services/workspaceApi";
import { missionSlice } from "@/stores/slices/missionSlice";
import { cloneDeep } from "lodash";
import { socket } from "@/socket";

const { createMissionInMissions, deleteMissionInMissions } =
  missionSlice.actions;
const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const AssignUserMission = ({ children, mission }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyWord] = useState("");
  const card = useSelector((state) => state.card.card);
  const workspace = useSelector((state) => state.workspace.workspace);
  const userMain = useSelector((state) => state.user.user);

  const CheckUserSearch = (userId) => {
    const check = filteredItems.some((item) => +item.id === +userId);
    return check;
  };

  const hasSearchFilter = Boolean(keyword);

  const userNotAssignCard = useMemo(() => {
    if (!workspace?.users || !card?.users) return [];

    const assignedUserIds = new Set(card.users.map(({ id }) => id));
    return workspace.users.filter(({ id }) => !assignedUserIds.has(id));
  }, [workspace?.users, card?.users]);

  const filteredItems = useMemo(() => {
    let filteredUsers = workspace?.users?.filter(Boolean) || [];

    if (hasSearchFilter && keyword) {
      const normalizedKeyword = keyword.toLowerCase();
      filteredUsers = filteredUsers.filter(
        ({ name, email }) =>
          name.toLowerCase().includes(normalizedKeyword) ||
          email.toLowerCase().includes(normalizedKeyword)
      );
    }

    return filteredUsers;
  }, [workspace?.users, keyword]);

  const AssignUser = async (userAssigned) => {
    if (userAssigned?.role?.toLowerCase() === "guest") {
      toast.error("Người này là khách không chỉ định được!");
      setIsOpen(false);
      return;
    }

    await toast
      .promise(
        async () =>
          await updateMissionApi(mission.id, { user_id: userAssigned.id }),
        { pending: "Đang thêm thành viên..." }
      )
      .then((res) => {
        const works = cloneDeep(card.works);
        const work = works.find((w) => w.id === mission.work_id);
        const missionUpdate = work?.missions.find((m) => m.id === mission.id);

        if (missionUpdate) {
          missionUpdate.user = userAssigned;
          missionUpdate.user_id = userAssigned.id;
        }

        const cardUpdate = {
          id: card.id,
          column_id: card.column_id,
          works,
        };

        dispatch(updateCard(cardUpdate));

        dispatch(updateCardInBoard(cardUpdate));

        if (userAssigned?.id === userMain?.id) {
          dispatch(createMissionInMissions(missionUpdate));
        } else {
          socket.emit("assignMission", {
            type: "assign",
            missionUpdate,
            user_id: userAssigned.id,
          });
        }

        toast.success("Thêm thành viên thành công");

        socket.emit("updateCard", cardUpdate);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsOpen(false);
      });
  };

  const CancelUser = async (userAssigned) => {
    if (!userAssigned) return;

    await toast
      .promise(
        async () => await updateMissionApi(mission.id, { user_id: null }),
        { pending: "Đang loại bỏ thành viên..." }
      )
      .then((res) => {
        const works = cloneDeep(card.works);
        const work = works.find((w) => w.id === mission.work_id);

        const missionUpdate = work?.missions.find((m) => m.id === mission.id);

        if (missionUpdate) {
          missionUpdate.user = null;
          missionUpdate.user_id = null;
        }

        const cardUpdate = {
          id: card.id,
          column_id: card.column_id,
          works,
        };

        dispatch(updateCard(cardUpdate));

        dispatch(updateCardInBoard(cardUpdate));

        if (userAssigned?.id === userMain?.id) {
          dispatch(deleteMissionInMissions({ id: mission.id }));
        } else {
          socket.emit("actionMission", {
            type: "un_assign",
            missionUpdate,
            user_id: userAssigned.id,
          });
        }

        toast.success("Loại bỏ thành viên thành công");

        socket.emit("updateCard", cardUpdate);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsOpen(false);
      });
  };

  const HandleSelectUserAssigned = async (userAssigned) => {
    try {
      if (+mission.user_id === +userAssigned.id) {
        CancelUser(userAssigned);
      } else {
        AssignUser(userAssigned);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setKeyWord("");
    }
  };

  return (
    <Popover
      placement="right"
      onClose={() => setIsOpen(false)}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (
          userMain.role.toLowerCase() === "admin" ||
          userMain.role.toLowerCase() === "owner"
        ) {
          setIsOpen(open);
        } else {
          toast.error("Bạn không đủ quyền thực hiện thao tác này");
        }
      }}
      classNames={{}}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 px-3">
        <div className="w-full">
          <div className="flex justify-between items-center relative">
            <h1 className="grow text-center ">Chỉ định</h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="mt-4">
            <Input
              onChange={(e) => setKeyWord(e.target.value)}
              value={keyword}
              variant="bordered"
              type="search"
              name="name"
              id="name"
              placeholder="Tìm kiếm..."
              size="xs"
              className="w-full "
            />
            {filteredItems?.length === 0 && (
              <span className="w-full h-[60px] flex items-center justify-center bg-default-200 mt-2 rounded-sm ">
                Không có kết quả
              </span>
            )}
            {userNotAssignCard?.length > 0 && (
              <div
                className={`${filteredItems.length === 0 && "hidden"} p-2 pb-0`}
              >
                <p className="font-medium text-xs ">Thành viên trong Bảng</p>
                <div className="max-h-[160px] overflow-y-auto">
                  {userNotAssignCard.map((user) => (
                    <div
                      onClick={() => HandleSelectUserAssigned(user)}
                      key={user.id}
                      className={`flex interceptor-loading items-center justify-between rounded-lg p-1 px-3 cursor-pointer mt-2 hover:bg-default-300 ${
                        !CheckUserSearch(user.id) && "hidden"
                      }`}
                    >
                      <User
                        avatarProps={{
                          radius: "full",
                          size: "sm",
                          src: user.avatar,
                          color: "secondary",
                          name: user.name.charAt(0).toUpperCase(),
                        }}
                        classNames={{
                          description: "text-default-500",
                        }}
                        name={user.name}
                        description={user.email}
                      >
                        {user.email}
                      </User>
                      {+user.id === +mission.user_id && <Check size={16} />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {card?.users?.length > 0 && (
              <div className={`${filteredItems.length === 0 && "hidden"} p-2 `}>
                <p className="font-medium text-xs">Thành viên trong Thẻ</p>
                <div className="max-h-[160px] overflow-y-auto">
                  {card.users.map((user) => (
                    <div
                      onClick={() => HandleSelectUserAssigned(user)}
                      key={user.id}
                      className={`flex items-center justify-between rounded-lg p-1 px-3 cursor-pointer mt-2 hover:bg-default-300 ${
                        !CheckUserSearch(user.id) && "hidden"
                      }`}
                    >
                      <User
                        avatarProps={{
                          radius: "full",
                          size: "sm",
                          src: user.avatar,
                          color: "secondary",
                          name: user.name.charAt(0).toUpperCase(),
                        }}
                        classNames={{
                          description: "text-default-500",
                        }}
                        description={user.email}
                        name={user.name}
                      >
                        {user.email}
                      </User>
                      {+user.id === +mission.user_id && <Check size={16} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            className="bg-default-200 w-full mt-2 font-medium text-sm interceptor-loading"
            isDisabled={!mission?.user}
            onClick={() => CancelUser(mission?.user)}
          >
            Loại bỏ thành viên
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default AssignUserMission;
