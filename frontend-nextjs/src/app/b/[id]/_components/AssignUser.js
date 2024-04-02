"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  User,
} from "@nextui-org/react";
import { SearchIcon, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { assignUserApi } from "@/services/workspaceApi";
import { toast } from "react-toastify";
const AssignUser = ({
  isAssign,
  setIsAssign,
  setUserAssigned,
  userAssigned,
  card,
}) => {
  const [timeoutId, setTimeoutId] = useState(null);
  const [keyword, setKeyWord] = useState("");
  const workspace = useSelector((state) => state.workspace.workspace);
  const [userSearch, setUserSearch] = useState([]);
  const userNotAssignCard = useMemo(() => {
    if (!workspace || !workspace.users || !userAssigned) {
      return [];
    }

    const assignedUserIds = userAssigned.map((user) => user.id);
    return workspace.users.filter((user) => !assignedUserIds.includes(user.id));
  }, [workspace, userAssigned]);

  const HandleSearchUser = async (e) => {
    const inputKeyword = e.target.value.toLowerCase().trim();
    setKeyWord(e.target.value);

    // Xóa timeout trước đó (nếu có)
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Thiết lập timeout mới
    const newTimeoutId = setTimeout(async () => {
      let userNew = [];
      for (const user of userNotAssignCard) {
        if (
          user.name.trim().toLowerCase().includes(inputKeyword) ||
          user.email.trim().toLowerCase().includes(inputKeyword)
        ) {
          userNew.push(user);
        }
      }
      setUserSearch(userNew);
    }, 2000); // Thời gian trễ là 2 giây

    // Lưu ID của timeout mới vào state
    setTimeoutId(newTimeoutId);
  };

  const HandleSelectUserAssigned = async (user) => {
    assignUserApi(card.id, { user_id: user.id }).then((data) => {
      if (data.status === 200) {
        const userAssignedUpdate = [...userAssigned, user];
        setUserAssigned(userAssignedUpdate);
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
    setKeyWord("");
    setIsAssign(false);
  };

  useEffect(() => {
    if (userNotAssignCard.length > 0) {
      setUserSearch(userNotAssignCard);
    }
  }, [userNotAssignCard]);

  return (
    <Popover
      isOpen={isAssign}
      onOpenChange={(assign) => {
        setIsAssign(assign);
      }}
      placement="right"
      classNames={{
        base: ["before:bg-default-200 px-0"],
        content: ["p-0 -translate-x-12 h-[300px] w-[280px] py-"],
      }}
    >
      <PopoverTrigger>
        <button
          onClick={() => setIsAssign(true)}
          className="flex rounded-full items-center justify-center p-1.5  text-default-300  border-dashed border-1.5 border-default-300  hover:border-indigo-400 hover:text-indigo-400 focus-visible:outline-none "
        >
          <UserPlus size={15} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-full rounded-lg flex flex-col h-full">
          <div>
            <Input
              value={keyword}
              onChange={(e) => HandleSearchUser(e)}
              variant="underlined"
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
          </div>

          <div className="grow overflow-x-auto p-2">
            {userSearch?.length > 0 ? (
              userSearch?.map((user) => (
                <div
                  key={user.id}
                  className=" rounded-lg p-1 px-3 cursor-pointer mt-2 hover:bg-default-300"
                  onClick={() => HandleSelectUserAssigned(user)}
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
                </div>
              ))
            ) : (
              <p className="w-full text-center text-md">Không có user nào</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default AssignUser;
