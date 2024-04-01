"use client";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  User,
} from "@nextui-org/react";
import { SearchIcon, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
const AssignUser = () => {
  const [isAssign, setIsAssign] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [keyword, setKeyWord] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const workspace = useSelector((state) => state.workspace.workspace);
  const [userAssign, setUserAssign] = useState([]);
  const HandleSearchUser = async (e) => {
    const inputKeyword = e.target.value.toLowerCase().trim();
    setKeyWord(e.target.value);

    // Xóa timeout trước đó (nếu có)
    clearTimeout(timeoutId);

    // Thiết lập timeout mới
    const newTimeoutId = setTimeout(async () => {
      let userNew = [];
      for (const user of workspace.users) {
        if (
          user.name.trim().toLowerCase().includes(inputKeyword) ||
          user.email.trim().toLowerCase().includes(inputKeyword)
        ) {
          userNew.push(user);
        }
      }
      setUserAssign(userNew);
    }, 2000); // Thời gian trễ là 2 giây

    // Lưu ID của timeout mới vào state
    setTimeoutId(newTimeoutId);
  };

  useEffect(() => {
    if (workspace.users.length > 0) {
      setUserAssign(workspace.users);
    }
  }, [workspace]);
  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      placement="right"
      classNames={{
        base: ["before:bg-default-200 px-0"],
        content: ["p-0 -translate-x-12 h-[300px] w-[280px] py-"],
      }}
    >
      <PopoverTrigger>
        <button
          onClick={() => setIsOpen(true)}
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

          <div className="grow overflow-x-auto">
            {userAssign.map((user) => (
              <div
                key={user.id}
                className=" rounded-lg p-1 px-3 cursor-pointer mt-2"
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
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default AssignUser;
