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
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { SearchIcon, Check } from "lucide-react";
import { cardSlice } from "@/stores/slices/cardSlice";
import { updateMissionApi } from "@/services/workspaceApi";

const { updateCard } = cardSlice.actions;
const AssignUserMission = ({ children, mission }) => {
  const dispatch = useDispatch();
  const [timeoutId, setTimeoutId] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyWord] = useState("");
  const card = useSelector((state) => state.card.card);
  const workspace = useSelector((state) => state.workspace.workspace);
  const userMain = useSelector((state) => state.user.user);
  const [userSearch, setUserSearch] = useState(workspace.users);
  const CheckUserSearch = (userId) => {
    const check = userSearch.some((item) => +item === userId);
    return check;
  };
  const userNotAssignCard = useMemo(() => {
    if (!workspace || !workspace.users || !card.users) {
      return [];
    }

    const assignedUserIds = card.users.map((user) => user.id);
    return workspace.users.filter((user) => !assignedUserIds.includes(user.id));
  }, [workspace, card]);

  const HandleSelectUserAssigned = async (userAssigned) => {
    const userIdUpdate =
      +userAssigned.id === mission.user_id ? null : userAssigned.id;
    const updatedWorks = card.works.map((work) => {
      if (+work.id === +mission.work_id) {
        const updatedMissions = work.missions.map((item) => {
          if (+item.id === +mission.id) {
            return {
              ...mission,
              user_id: userIdUpdate,
              user: userIdUpdate && userAssigned,
            };
          }
          return mission;
        });
        return { ...work, missions: updatedMissions };
      }
      return work;
    });
    const updatedCard = { ...card, works: updatedWorks };
    updateMissionApi(mission.id, { user_id: userIdUpdate }).then((data) => {
      if (data.status === 200) {
        dispatch(updateCard(updatedCard));
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
  };

  const CancelUser = async () => {
    const updatedWorks = card.works.map((work) => {
      if (+work.id === +mission.work_id) {
        const updatedMissions = work.missions.map((item) => {
          if (+item.id === +mission.id) {
            return {
              ...mission,
              user_id: null,
              user: null,
            };
          }
          return mission;
        });
        return { ...work, missions: updatedMissions };
      }
      return work;
    });
    const updatedCard = { ...card, works: updatedWorks };
    updateMissionApi(mission.id, { user_id: null }).then((data) => {
      if (data.status === 200) {
        dispatch(updateCard(updatedCard));
        setKeyWord("");
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
  };

  const HandleSearchUser = async (e) => {
    const inputKeyword = e.target.value.toLowerCase().trim();
    setKeyWord(e.target.value);
    // Xóa timeout trước đó (nếu có)
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Thiết lập timeout mới
    const newTimeoutId = setTimeout(async () => {
      let usersIdNew = [];
      for (const user of workspace.users) {
        if (
          user.name.trim().toLowerCase().includes(inputKeyword) ||
          user.email.trim().toLowerCase().includes(inputKeyword)
        ) {
          usersIdNew.push(user.id);
        }
      }
      setUserSearch(usersIdNew);
    }, 2000); // Thời gian trễ là 2 giây

    // Lưu ID của timeout mới vào state
    setTimeoutId(newTimeoutId);
  };

  useEffect(() => {
    if (workspace.users.length > 0) {
      const userIds = workspace.users.map((user) => user.id);
      setUserSearch(userIds);
    }
  }, []);

  const HandleReset = async () => {
    setIsOpen(false);
    setKeyWord("");
    const userIds = workspace.users.map((user) => user.id);
    setUserSearch(userIds);
  };
  return (
    <Popover
      placement="right"
      onClose={HandleReset}
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
              onChange={(e) => HandleSearchUser(e)}
              value={keyword}
              variant="bordered"
              type="text"
              name="name"
              id="name"
              startContent={
                <div className="pl-2">
                  <SearchIcon size={16} />
                </div>
              }
              placeholder="Tìm kiếm..."
              size="xs"
              className="w-full "
            />
            {userSearch.length === 0 && (
              <span className="w-full h-[60px] flex items-center justify-center bg-default-200 mt-2 rounded-sm ">
                Không có kết quả
              </span>
            )}
            {userNotAssignCard?.length > 0 && (
              <div
                className={`${userSearch.length === 0 && "hidden"} p-2 pb-0`}
              >
                <p className="font-medium text-xs">Thành viên trong Bảng</p>
                <div className="max-h-[160px] overflow-y-auto">
                  {userNotAssignCard.map((user) => (
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
              <div className={`${userSearch.length === 0 && "hidden"} p-2 `}>
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
            className="bg-default-200 w-full mt-2 font-medium text-sm"
            isDisabled={!mission?.user}
            onClick={() => CancelUser()}
          >
            Loại bỏ thành viên
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default AssignUserMission;
