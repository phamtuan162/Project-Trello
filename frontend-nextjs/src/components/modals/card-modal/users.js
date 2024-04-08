"use client";
import { useSelector } from "react-redux";
import { AvatarGroup, Avatar } from "@nextui-org/react";
import { Plus } from "lucide-react";
import AssignUser from "@/app/b/[id]/_components/AssignUser";
import { useState } from "react";
const UserCard = () => {
  const card = useSelector((state) => state.card.card);
  const [isAssign, setIsAssign] = useState(false);
  if (card?.users?.length == 0) {
    return;
  }
  return (
    <div className="flex flex-col">
      <p
        className="text-xs font-medium text-neutral-700 mb-2"
        style={{ color: "#44546f" }}
      >
        Thành viên
      </p>
      <div className="items-center flex gap-2 cursor-pointer grow">
        <AvatarGroup max={2} className="justify-start group-avatar-1 ">
          {card?.users?.map((user) => (
            <Avatar
              key={user.id}
              src={user.avatar}
              name={user.name.charAt(0).toUpperCase()}
              radius="full"
              color="secondary"
            />
          ))}
        </AvatarGroup>
        <AssignUser
          cardUpdate={card}
          isAssign={isAssign}
          setIsAssign={setIsAssign}
        >
          <span
            className="h-[24px] w-[24px] rounded-full flex items-center justify-center"
            style={{ background: "#091e420f", color: "#172B4D" }}
          >
            <Plus size={14} />
          </span>
        </AssignUser>
      </div>
    </div>
  );
};
export default UserCard;
